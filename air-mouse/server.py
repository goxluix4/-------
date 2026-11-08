"""
手機空中滑鼠 - 電腦端伺服器

- HTTPS（自簽憑證）提供手機網頁，同一個埠提供 WSS (/ws)
- 手機用陀螺儀送出位移，伺服器移動游標、點擊、捲動
- Windows 使用 Win32 API (ctypes)，不需額外滑鼠套件

用法：
    python server.py              # 預設埠 8443
    python server.py --port 9443
    python server.py --dry-run    # 不實際控制滑鼠，只印出指令（測試用）
"""

from __future__ import annotations

import argparse
import asyncio
import datetime
import ipaddress
import json
import os
import socket
import ssl
import sys
from pathlib import Path

from aiohttp import WSMsgType, web

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
CERT_DIR = BASE_DIR / "certs"
CERT_FILE = CERT_DIR / "cert.pem"
KEY_FILE = CERT_DIR / "key.pem"


# ---------------------------------------------------------------------------
# 滑鼠後端
# ---------------------------------------------------------------------------
class MouseBase:
    def __init__(self) -> None:
        self._rx = 0.0  # 未滿 1 像素的累積餘數
        self._ry = 0.0
        self._scroll_v = 0.0
        self._scroll_h = 0.0

    def move(self, dx: float, dy: float) -> None:
        self._rx += dx
        self._ry += dy
        ix, iy = int(self._rx), int(self._ry)
        if ix or iy:
            self._rx -= ix
            self._ry -= iy
            self._move_px(ix, iy)

    def scroll(self, dy: float, dx: float = 0.0) -> None:
        # dy/dx 以「滾輪刻度」為單位，1.0 = 一格 (WHEEL_DELTA 120)
        self._scroll_v += dy * 120
        self._scroll_h += dx * 120
        iv, ih = int(self._scroll_v), int(self._scroll_h)
        if iv:
            self._scroll_v -= iv
            self._wheel(iv, horizontal=False)
        if ih:
            self._scroll_h -= ih
            self._wheel(ih, horizontal=True)

    # 子類實作
    def _move_px(self, dx: int, dy: int) -> None: ...
    def _wheel(self, amount: int, horizontal: bool) -> None: ...
    def button(self, which: str, action: str) -> None: ...

    def click(self, which: str) -> None:
        self.button(which, "down")
        self.button(which, "up")


class WindowsMouse(MouseBase):
    MOUSEEVENTF_LEFTDOWN = 0x0002
    MOUSEEVENTF_LEFTUP = 0x0004
    MOUSEEVENTF_RIGHTDOWN = 0x0008
    MOUSEEVENTF_RIGHTUP = 0x0010
    MOUSEEVENTF_MIDDLEDOWN = 0x0020
    MOUSEEVENTF_MIDDLEUP = 0x0040
    MOUSEEVENTF_WHEEL = 0x0800
    MOUSEEVENTF_HWHEEL = 0x1000

    def __init__(self) -> None:
        super().__init__()
        import ctypes
        from ctypes import wintypes

        self.ctypes = ctypes
        self.user32 = ctypes.windll.user32
        # 高 DPI 螢幕下取得真實像素座標
        try:
            ctypes.windll.shcore.SetProcessDpiAwareness(2)
        except Exception:
            try:
                self.user32.SetProcessDPIAware()
            except Exception:
                pass
        self.point = wintypes.POINT()

    def _bounds(self):
        gsm = self.user32.GetSystemMetrics
        left, top = gsm(76), gsm(77)  # SM_XVIRTUALSCREEN / SM_YVIRTUALSCREEN（支援多螢幕）
        return left, top, left + gsm(78) - 1, top + gsm(79) - 1

    def _move_px(self, dx: int, dy: int) -> None:
        # 用 SetCursorPos 直接設定位置，不受 Windows「指標加速」影響，手感一致
        self.user32.GetCursorPos(self.ctypes.byref(self.point))
        l, t, r, b = self._bounds()
        x = min(max(self.point.x + dx, l), r)
        y = min(max(self.point.y + dy, t), b)
        self.user32.SetCursorPos(x, y)

    def _wheel(self, amount: int, horizontal: bool) -> None:
        flag = self.MOUSEEVENTF_HWHEEL if horizontal else self.MOUSEEVENTF_WHEEL
        self.user32.mouse_event(flag, 0, 0, amount, 0)

    def button(self, which: str, action: str) -> None:
        flags = {
            ("left", "down"): self.MOUSEEVENTF_LEFTDOWN,
            ("left", "up"): self.MOUSEEVENTF_LEFTUP,
            ("right", "down"): self.MOUSEEVENTF_RIGHTDOWN,
            ("right", "up"): self.MOUSEEVENTF_RIGHTUP,
            ("middle", "down"): self.MOUSEEVENTF_MIDDLEDOWN,
            ("middle", "up"): self.MOUSEEVENTF_MIDDLEUP,
        }
        f = flags.get((which, action))
        if f:
            self.user32.mouse_event(f, 0, 0, 0, 0)


class PynputMouse(MouseBase):
    """非 Windows 平台的備援（需要 pip install pynput）。"""

    def __init__(self) -> None:
        super().__init__()
        from pynput.mouse import Button, Controller

        self.m = Controller()
        self.btn = {"left": Button.left, "right": Button.right, "middle": Button.middle}

    def _move_px(self, dx: int, dy: int) -> None:
        self.m.move(dx, dy)

    def _wheel(self, amount: int, horizontal: bool) -> None:
        # pynput 以「格」為單位，Windows 正值=往上，與 pynput 相同
        steps = amount / 120
        self.m.scroll(steps if horizontal else 0, 0 if horizontal else steps)

    def button(self, which: str, action: str) -> None:
        b = self.btn.get(which)
        if b:
            (self.m.press if action == "down" else self.m.release)(b)


class DryRunMouse(MouseBase):
    def _move_px(self, dx: int, dy: int) -> None:
        print(f"[move] {dx:+d}, {dy:+d}")

    def _wheel(self, amount: int, horizontal: bool) -> None:
        print(f"[wheel{'-h' if horizontal else ''}] {amount:+d}")

    def button(self, which: str, action: str) -> None:
        print(f"[button] {which} {action}")


def create_mouse(dry_run: bool) -> MouseBase:
    if dry_run:
        return DryRunMouse()
    if sys.platform == "win32":
        return WindowsMouse()
    try:
        return PynputMouse()
    except Exception as e:  # noqa: BLE001
        print(f"⚠ 無法控制滑鼠 ({e})，改用 dry-run 模式。")
        return DryRunMouse()


# ---------------------------------------------------------------------------
# 網路 / 憑證
# ---------------------------------------------------------------------------
def get_lan_ips() -> list[str]:
    ips: list[str] = []
    # 以「預設路由」那張網卡為主（不會真的送封包）
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("10.255.255.255", 1))
        ips.append(s.getsockname()[0])
        s.close()
    except OSError:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if ip not in ips:
                ips.append(ip)
    except OSError:
        pass
    ips = [ip for ip in ips if not ip.startswith("127.") and not ip.startswith("169.254.")]
    return ips or ["127.0.0.1"]


def get_mdns_name() -> str | None:
    """電腦名稱.local（Windows 10/11、iPhone、多數新 Android 都支援），IP 變了也能用。"""
    name = socket.gethostname().split(".")[0].strip().lower()
    if name and all(c.isalnum() or c == "-" for c in name) and name.isascii():
        return f"{name}.local"
    return None


def ensure_certificate(ips: list[str], dns_names: list[str]) -> None:
    """產生（或重新產生）自簽憑證，SAN 內含目前所有區網 IP。"""
    from cryptography import x509
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import ec
    from cryptography.x509.oid import NameOID

    wanted = set(ips) | {"127.0.0.1"} | set(dns_names)
    wanted_ips = set(ips) | {"127.0.0.1"}

    if CERT_FILE.exists() and KEY_FILE.exists():
        try:
            cert = x509.load_pem_x509_certificate(CERT_FILE.read_bytes())
            san = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName).value
            have = {str(ip) for ip in san.get_values_for_type(x509.IPAddress)}
            have |= set(san.get_values_for_type(x509.DNSName))
            not_expired = cert.not_valid_after_utc > datetime.datetime.now(datetime.timezone.utc)
            if wanted <= have and not_expired:
                return
            print("IP 位址已變更，重新產生憑證…")
        except Exception:  # noqa: BLE001
            pass

    CERT_DIR.mkdir(exist_ok=True)
    key = ec.generate_private_key(ec.SECP256R1())
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "Air Mouse (self-signed)")])
    now = datetime.datetime.now(datetime.timezone.utc)
    alt_names: list[x509.GeneralName] = [x509.DNSName("localhost")]
    alt_names += [x509.DNSName(n) for n in dns_names]
    alt_names += [x509.IPAddress(ipaddress.ip_address(ip)) for ip in sorted(wanted_ips)]
    cert = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - datetime.timedelta(days=1))
        .not_valid_after(now + datetime.timedelta(days=825))
        .add_extension(x509.SubjectAlternativeName(alt_names), critical=False)
        .add_extension(x509.BasicConstraints(ca=False, path_length=None), critical=True)
        .add_extension(
            x509.ExtendedKeyUsage([x509.oid.ExtendedKeyUsageOID.SERVER_AUTH]), critical=False
        )
        .sign(key, hashes.SHA256())
    )
    KEY_FILE.write_bytes(
        key.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.PKCS8,
            serialization.NoEncryption(),
        )
    )
    CERT_FILE.write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    print(f"已產生自簽憑證：{CERT_FILE}")


def print_qr(url: str) -> None:
    try:
        import qrcode

        qr = qrcode.QRCode(border=1)
        qr.add_data(url)
        qr.make(fit=True)
        qr.print_ascii(invert=True)
    except Exception:  # noqa: BLE001  (未安裝 qrcode 或主控台不支援 Unicode)
        pass


# ---------------------------------------------------------------------------
# 自動尋找區網內其他電腦（UDP 廣播）
# ---------------------------------------------------------------------------
DISCOVERY_PORT = 8442
PEER_TIMEOUT = 8.0  # 秒；超過沒收到廣播就視為離線


class Discovery(asyncio.DatagramProtocol):
    """每台電腦定時廣播「我在這裡」，同時收集其他電腦的廣播。"""

    def __init__(self, my_id: str, name: str, port: int) -> None:
        self.my_id, self.name, self.port = my_id, name, port
        self.peers: dict[str, dict] = {}
        self.transport: asyncio.DatagramTransport | None = None

    def connection_made(self, transport) -> None:  # type: ignore[override]
        self.transport = transport

    def datagram_received(self, data: bytes, addr) -> None:  # type: ignore[override]
        try:
            msg = json.loads(data.decode("utf-8"))
        except ValueError:
            return
        if msg.get("app") != "airmouse" or msg.get("id") == self.my_id:
            return
        try:
            port = int(msg.get("port", 8443))
        except (TypeError, ValueError):
            return
        self.peers[str(msg["id"])] = {
            "id": str(msg["id"]),
            "name": str(msg.get("name", addr[0]))[:40],
            "ip": addr[0],
            "port": port,
            "seen": asyncio.get_running_loop().time(),
        }

    def online_peers(self) -> list[dict]:
        now = asyncio.get_running_loop().time()
        return [p for p in self.peers.values() if now - p["seen"] < PEER_TIMEOUT]

    async def announce_forever(self) -> None:
        payload = json.dumps(
            {"app": "airmouse", "v": 1, "id": self.my_id, "name": self.name, "port": self.port}
        ).encode("utf-8")
        while True:
            targets = {"255.255.255.255"}
            for ip in get_lan_ips():  # 也送子網路廣播，多網卡時比較可靠
                parts = ip.split(".")
                if len(parts) == 4 and ip != "127.0.0.1":
                    targets.add(".".join(parts[:3] + ["255"]))
            for t in targets:
                try:
                    if self.transport:
                        self.transport.sendto(payload, (t, DISCOVERY_PORT))
                except OSError:
                    pass
            await asyncio.sleep(2)


async def start_discovery(app: web.Application) -> None:
    disc: Discovery = app["discovery"]
    loop = asyncio.get_running_loop()
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    try:
        sock.bind(("", DISCOVERY_PORT))
    except OSError as e:
        print(f"⚠ 無法啟用自動尋找電腦（UDP {DISCOVERY_PORT}）：{e}")
        sock.close()
        return
    await loop.create_datagram_endpoint(lambda: disc, sock=sock)
    app["announce_task"] = asyncio.create_task(disc.announce_forever())


async def stop_discovery(app: web.Application) -> None:
    task = app.get("announce_task")
    if task:
        task.cancel()
    if app["discovery"].transport:
        app["discovery"].transport.close()
    await app["http"].close()


# ---------------------------------------------------------------------------
# Bonjour / mDNS 廣播（iPhone App 用來自動找到電腦）
# ---------------------------------------------------------------------------
BONJOUR_TYPE = "_airmouse._tcp.local."


def cert_fingerprint() -> str:
    """憑證的 SHA-256 指紋；App 用它確認連到的是這台電腦，不需要信任憑證。"""
    from cryptography import x509
    from cryptography.hazmat.primitives import hashes

    cert = x509.load_pem_x509_certificate(CERT_FILE.read_bytes())
    return cert.fingerprint(hashes.SHA256()).hex()


def bonjour_name(name: str) -> str:
    raw = name.encode("utf-8")[:60]
    return raw.decode("utf-8", errors="ignore").replace(".", "-") or "AirMouse"


async def start_bonjour(app: web.Application) -> None:
    try:
        from zeroconf import IPVersion, ServiceInfo
        from zeroconf.asyncio import AsyncZeroconf
    except ImportError:
        print("⚠ 未安裝 zeroconf，iPhone App 將無法自動找到這台電腦（pip install zeroconf）")
        return
    try:
        ips = [ip for ip in get_lan_ips() if ip != "127.0.0.1"]
        info = ServiceInfo(
            BONJOUR_TYPE,
            f"{bonjour_name(app['pc_name'])}.{BONJOUR_TYPE}",
            addresses=[socket.inet_aton(ip) for ip in ips],
            port=app["pc_port"],
            properties={
                "v": "1",
                "fp": cert_fingerprint(),
                "id": app["pc_id"],
                "ip": ",".join(ips),
                "port": str(app["pc_port"]),
            },
            server=f"{socket.gethostname().split('.')[0]}.local.",
        )
        azc = AsyncZeroconf(ip_version=IPVersion.V4Only)
        await azc.async_register_service(info, allow_name_change=True)
        app["bonjour"] = (azc, info)
    except Exception as e:  # noqa: BLE001
        print(f"⚠ Bonjour 廣播啟動失敗（iPhone App 可能找不到這台電腦）：{e}")


async def stop_bonjour(app: web.Application) -> None:
    if "bonjour" in app:
        azc, info = app["bonjour"]
        try:
            await azc.async_unregister_service(info)
        finally:
            await azc.async_close()


# ---------------------------------------------------------------------------
# Web 應用
# ---------------------------------------------------------------------------
def build_app(mouse: MouseBase, my_id: str, name: str, port: int) -> web.Application:
    app = web.Application()
    app["discovery"] = Discovery(my_id, name, port)
    clients: set[web.WebSocketResponse] = set()

    async def make_session(app_: web.Application) -> None:
        import aiohttp

        app_["http"] = aiohttp.ClientSession()

    app.on_startup.append(make_session)
    app["pc_id"], app["pc_name"], app["pc_port"] = my_id, name, port
    app.on_startup.append(start_discovery)
    app.on_startup.append(start_bonjour)
    app.on_cleanup.append(stop_bonjour)
    app.on_cleanup.append(stop_discovery)

    async def index(request: web.Request) -> web.StreamResponse:
        if request.headers.get("Upgrade", "").lower() == "websocket":
            return await ws_handler(request)
        resp = web.FileResponse(STATIC_DIR / "index.html")
        resp.headers["Cache-Control"] = "no-store"
        return resp

    async def computers(_request: web.Request) -> web.Response:
        items = [{"id": my_id, "name": name, "ip": "本機", "self": True}]
        for p in sorted(app["discovery"].online_peers(), key=lambda p: p["name"].lower()):
            items.append({"id": p["id"], "name": p["name"], "ip": p["ip"], "self": False})
        return web.json_response(items, headers={"Cache-Control": "no-store"})

    def handle_local(data: dict, held: set[str]) -> None:
        t = data.get("t")
        if t == "m":
            dx, dy = float(data.get("x", 0)), float(data.get("y", 0))
            # 防呆：限制單一封包最大位移
            mouse.move(max(-500, min(500, dx)), max(-500, min(500, dy)))
        elif t == "c":
            mouse.click(str(data.get("b", "left")))
        elif t == "b":
            b, a = str(data.get("b", "left")), str(data.get("a", "up"))
            mouse.button(b, a)
            (held.add if a == "down" else held.discard)(b)
        elif t == "s":
            mouse.scroll(
                max(-50, min(50, float(data.get("y", 0)))),
                max(-50, min(50, float(data.get("x", 0)))),
            )

    async def ws_handler(request: web.Request) -> web.WebSocketResponse:
        ws = web.WebSocketResponse(heartbeat=10, max_msg_size=64 * 1024)
        await ws.prepare(request)
        clients.add(ws)
        held: set[str] = set()
        peer_ws = None          # 轉送到其他電腦時的連線
        target = my_id          # 目前控制哪台電腦
        who = request.remote
        print(f"📱 手機已連線：{who}（目前 {len(clients)} 台）")

        async def close_peer() -> None:
            nonlocal peer_ws
            if peer_ws is not None and not peer_ws.closed:
                await peer_ws.close()
            peer_ws = None

        try:
            async for msg in ws:
                if msg.type != WSMsgType.TEXT:
                    continue
                try:
                    data = json.loads(msg.data)
                except ValueError:
                    continue
                t = data.get("t")
                if t == "ping":
                    await ws.send_str(json.dumps({"t": "pong", "ts": data.get("ts")}))
                    continue
                if t == "sel":  # 手機選擇要控制的電腦
                    await close_peer()
                    for b in list(held):
                        mouse.button(b, "up")
                    held.clear()
                    want = str(data.get("id", my_id))
                    if want == my_id:
                        target = my_id
                        await ws.send_str(json.dumps({"t": "sel", "ok": True, "name": name}))
                        print(f"🖱 {who} 控制：本機")
                        continue
                    p = app["discovery"].peers.get(want)
                    if not p:
                        await ws.send_str(json.dumps({"t": "sel", "ok": False, "err": "找不到這台電腦"}))
                        continue
                    try:
                        # 電腦之間用自簽憑證，不驗證（只在區網內）
                        peer_ws = await asyncio.wait_for(
                            app["http"].ws_connect(
                                f"wss://{p['ip']}:{p['port']}/ws", ssl=False, heartbeat=10
                            ),
                            timeout=5,
                        )
                        target = want
                        await ws.send_str(json.dumps({"t": "sel", "ok": True, "name": p["name"]}))
                        print(f"🖱 {who} 控制：{p['name']} ({p['ip']})，由本機轉送")
                    except Exception as e:  # noqa: BLE001
                        target = my_id
                        await ws.send_str(
                            json.dumps({"t": "sel", "ok": False, "err": f"連不到 {p['name']}：{e}"})
                        )
                    continue

                if target == my_id:
                    try:
                        handle_local(data, held)
                    except (TypeError, ValueError):
                        continue
                elif peer_ws is not None and not peer_ws.closed:
                    try:
                        await peer_ws.send_str(msg.data)
                    except Exception:  # noqa: BLE001
                        await close_peer()
                        await ws.send_str(json.dumps({"t": "sel", "ok": False, "err": "和那台電腦的連線中斷了"}))
                else:
                    await ws.send_str(json.dumps({"t": "sel", "ok": False, "err": "和那台電腦的連線中斷了"}))
                    target = my_id
        finally:
            clients.discard(ws)
            await close_peer()
            # 斷線時放開可能還按著的按鍵，避免卡住
            for b in list(held):
                try:
                    mouse.button(b, "up")
                except Exception:  # noqa: BLE001
                    pass
            print(f"📴 手機已斷線：{who}（剩 {len(clients)} 台）")
        return ws

    app.router.add_get("/", index)
    app.router.add_get("/ws", ws_handler)
    app.router.add_get("/api/computers", computers)
    app.router.add_static("/static", STATIC_DIR)
    return app


def main() -> None:
    parser = argparse.ArgumentParser(description="手機空中滑鼠伺服器")
    parser.add_argument("--port", type=int, default=8443)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--dry-run", action="store_true", help="不控制滑鼠，只印出指令")
    parser.add_argument("--name", default=None, help="在手機清單上顯示的電腦名稱（預設為電腦名稱）")
    args = parser.parse_args()

    if sys.platform == "win32":
        # 讓 Windows 主控台正確顯示中文
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            os.system("")  # 啟用 ANSI
        except Exception:  # noqa: BLE001
            pass

    ips = get_lan_ips()
    mdns = get_mdns_name()
    ensure_certificate(ips, [mdns] if mdns else [])
    ssl_ctx = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_ctx.load_cert_chain(CERT_FILE, KEY_FILE)

    mouse = create_mouse(args.dry_run)
    name = (args.name or socket.gethostname().split(".")[0] or "電腦")[:40]
    my_id = f"{socket.gethostname()}:{args.port}"
    app = build_app(mouse, my_id, name, args.port)

    url = f"https://{ips[0]}:{args.port}"
    print("=" * 56)
    print(" 手機空中滑鼠 已啟動")
    print(f" 電腦名稱：{name}　滑鼠後端：{type(mouse).__name__}")
    print(" 請讓手機連上「同一個 Wi-Fi」，用瀏覽器開啟：")
    for ip in ips:
        print(f"   👉 https://{ip}:{args.port}")
    if mdns:
        print(f"   👉 https://{mdns}:{args.port}   ← 用電腦名稱，IP 變了也能用（部分 Android 不支援）")
    print(" 第一次會出現「憑證不安全」警告：")
    print("   Android Chrome：進階 → 繼續前往")
    print("   iPhone Safari ：顯示詳細資訊 → 造訪此網站")
    print(" 按 Ctrl+C 結束")
    print("=" * 56)
    print_qr(url)

    # 把網址存成文字檔（背景自動啟動時看不到視窗，可以開這個檔案查）
    try:
        lines = [f"https://{ip}:{args.port}" for ip in ips]
        if mdns:
            lines.append(f"https://{mdns}:{args.port}")
        (BASE_DIR / "目前網址.txt").write_text(
            "手機用瀏覽器開以下任一網址：\n" + "\n".join(lines) + "\n", encoding="utf-8"
        )
    except OSError:
        pass

    try:
        web.run_app(app, host=args.host, port=args.port, ssl_context=ssl_ctx, print=None)
    except KeyboardInterrupt:
        pass
    except OSError as e:
        print(f"\n❌ 無法使用埠 {args.port}：{e}")
        print("   可能空中滑鼠已經在背景執行（開機自動啟動），手機直接開網址即可；")
        print("   或改用其他埠：python server.py --port 9443")


if __name__ == "__main__":
    main()
