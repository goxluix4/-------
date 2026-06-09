import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, STUDIO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-gray-mid">
      {/* ── 主內容 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* 品牌欄 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Jay Hu 工程文件工作室"
                width={44}
                height={44}
                className="rounded-full flex-shrink-0"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-brand-gold font-bold text-sm tracking-wider uppercase">
                  JAY HU
                </span>
                <span className="text-brand-dark text-xs">工程文件工作室</span>
              </span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed">
              承接公共工程、土木營造及工程文件整編服務。<br/>
              讓現場專心施工，文件整編交給專業處理。
            </p>
          </div>

          {/* 快速連結 */}
          <div>
            <h4 className="text-brand-gold font-semibold mb-4 text-sm tracking-wide uppercase">
              快速連結
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-muted hover:text-brand-gold text-sm
                      transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/quote"
                  className="text-brand-gold hover:text-brand-gold-light
                    text-sm font-medium transition-colors duration-200"
                >
                  → 線上詢價表單
                </Link>
              </li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h4 className="text-brand-gold font-semibold mb-4 text-sm tracking-wide uppercase">
              聯絡方式
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a
                  href={`tel:${STUDIO.phone.replace(/-/g, "")}`}
                  className="text-brand-muted hover:text-brand-gold text-sm transition-colors"
                >
                  {STUDIO.contactName}｜{STUDIO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a
                  href={`mailto:${STUDIO.email}`}
                  className="text-brand-muted hover:text-brand-gold text-sm transition-colors"
                >
                  {STUDIO.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-gold flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                <a
                  href={STUDIO.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-gold text-sm transition-colors"
                >
                  LINE：{STUDIO.lineId}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-gold flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a
                  href={STUDIO.fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-gold text-sm transition-colors"
                >
                  Facebook 粉絲專頁
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── 底部版權 ── */}
      <div className="border-t border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
          flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-brand-muted text-xs">
            © {new Date().getFullYear()} Jay Hu 工程文件工作室．All rights reserved.
          </p>
          <p className="text-brand-muted/60 text-xs">
            {STUDIO.nameEn}
          </p>
        </div>
      </div>
    </footer>
  );
}
