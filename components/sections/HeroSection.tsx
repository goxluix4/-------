import Link from "next/link";
import Image from "next/image";
import { STUDIO } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="blueprint-bg relative min-h-screen flex items-center
        overflow-hidden pt-16"
    >
      {/* 右上角角框裝飾（名片同款） */}
      <div className="absolute right-6 top-20 opacity-30 pointer-events-none" aria-hidden="true">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M100 0 L100 40 M60 0 L100 0" stroke="#c9a227" strokeWidth="2"/>
        </svg>
      </div>

      {/* 左下角角框裝飾 */}
      <div className="absolute left-6 bottom-20 opacity-30 pointer-events-none" aria-hidden="true">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M0 100 L0 60 M40 100 L0 100" stroke="#c9a227" strokeWidth="2"/>
        </svg>
      </div>

      {/* 右側裝飾斜線 */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-8 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <line x1="500" y1="0"   x2="150" y2="800" stroke="#c9a227" strokeWidth="1.2"/>
          <line x1="420" y1="0"   x2="70"  y2="800" stroke="#c9a227" strokeWidth="0.6"/>
          <circle cx="380" cy="220" r="130" stroke="#c9a227" strokeWidth="0.8"/>
          <circle cx="380" cy="220" r="80"  stroke="#c9a227" strokeWidth="0.4"/>
          <line x1="250" y1="220" x2="500" y2="220" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="4 4"/>
        </svg>
      </div>

      {/* 主要內容 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* 右側 Logo（桌機顯示） */}
        <div className="hidden lg:flex flex-col items-center justify-center order-last lg:order-last flex-shrink-0">
          <div className="relative">
            {/* 金色光暈 */}
            <div className="absolute inset-0 rounded-full bg-brand-gold/10 blur-2xl scale-125" />
            <Image
              src="/images/logo.png"
              alt="Jay Hu 工程文件工作室"
              width={280}
              height={280}
              className="relative rounded-full shadow-xl border-4 border-brand-gold/20"
              priority
            />
          </div>
        </div>

        <div className="max-w-2xl flex-1">

          {/* 標籤列 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["公共工程", "土木營造", "工程文件整編"].map((tag) => (
              <span
                key={tag}
                className="inline-block border border-brand-gold text-brand-gold
                  text-xs font-medium px-3 py-1 rounded-full bg-brand-gold/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 品牌名稱 */}
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            Jay Hu Engineering Document Studio
          </p>

          {/* 主標題 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-4">
            讓現場<span className="text-gradient-gold">專心施工</span>
            <br />
            文件整編<span className="text-gradient-gold">交給專業</span>
          </h1>

          {/* 金色分隔線 */}
          <div className="gold-divider mb-5" />

          {/* 副標語 */}
          <p className="text-brand-navy text-lg sm:text-xl mb-3 leading-relaxed font-medium">
            {STUDIO.tagline}
          </p>
          <p className="text-brand-gold text-base mb-8">
            {STUDIO.sub}
          </p>

          {/* 說明文字 */}
          <p className="text-brand-muted text-sm mb-10 max-w-xl leading-relaxed">
            工程文件不是只有排版，重點在邏輯與實用性。<br />
            承接公共工程、土木營造及工程文件整編，送審、查核、缺失改善，一次到位。
          </p>

          {/* CTA 按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote" className="btn-gold text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              立即詢價
            </Link>
            <Link
              href={STUDIO.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white text-base px-8 py-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINE 聯絡我
            </Link>
          </div>

          {/* 統計數字 */}
          <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-brand-gold/20">
            <div>
              <p className="text-brand-gold text-3xl font-bold">20+</p>
              <p className="text-brand-muted text-xs mt-1">公共工程案件</p>
            </div>
            <div>
              <p className="text-brand-gold text-3xl font-bold">10</p>
              <p className="text-brand-muted text-xs mt-1">服務項目</p>
            </div>
            <div>
              <p className="text-brand-gold text-3xl font-bold">急件</p>
              <p className="text-brand-muted text-xs mt-1">可評估承接</p>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* 底部往下滾動提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2
        flex flex-col items-center gap-2 text-brand-gold/50 text-xs">
        <span>向下捲動</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}
