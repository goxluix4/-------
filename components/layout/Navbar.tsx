"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, STUDIO } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-brand-gold/20"
          : "bg-white/90 backdrop-blur-sm border-b border-brand-gold/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={closeMenu}
          >
            <Image
              src="/images/logo.png"
              alt="Jay Hu 工程文件工作室"
              width={40}
              height={40}
              className="rounded-full flex-shrink-0"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-brand-gold font-bold text-base tracking-wider uppercase">
                JAY HU
              </span>
              <span className="text-brand-dark text-xs tracking-wide">
                工程文件工作室
              </span>
            </span>
          </Link>

          {/* ── 桌機版導覽 ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-navy/80 hover:text-brand-gold px-3 py-2 text-sm
                  font-medium transition-colors duration-200 rounded-md
                  hover:bg-brand-gold/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── 桌機 CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={STUDIO.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white text-sm px-4 py-2"
            >
              <svg
                className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"
              >
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINE 聯絡
            </Link>
            <Link href="/quote" className="btn-gold text-sm px-4 py-2">
              立即詢價
            </Link>
          </div>

          {/* ── 手機版漢堡按鈕 ── */}
          <button
            className="lg:hidden p-2 rounded-md text-brand-navy/80 hover:text-brand-dark
              hover:bg-brand-gold/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="開啟選單"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── 手機版展開選單 ── */}
      {open && (
        <div className="lg:hidden bg-white border-t border-brand-gold/20 pb-4">
          <nav className="flex flex-col px-4 pt-2 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-brand-navy/80 hover:text-brand-gold hover:bg-brand-gold/5
                  px-3 py-3 text-sm font-medium rounded-md
                  border-b border-brand-gold/10 last:border-0
                  transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-brand-gold/20">
              <Link
                href={STUDIO.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="btn-outline-white text-sm py-2.5 w-full"
              >
                LINE 聯絡
              </Link>
              <Link
                href="/quote"
                onClick={closeMenu}
                className="btn-gold text-sm py-2.5 w-full"
              >
                立即詢價
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
