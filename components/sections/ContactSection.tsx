import Image from "next/image";
import Link from "next/link";
import { STUDIO } from "@/lib/constants";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-brand-gray py-20 lg:py-28 relative overflow-hidden">

      {/* 背景點陣裝飾 */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(201,162,39,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 左下角角框裝飾 */}
      <div className="absolute left-8 bottom-8 opacity-20 pointer-events-none" aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 80 L0 48 M32 80 L0 80" stroke="#c9a227" strokeWidth="2"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 標題 */}
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="section-title text-brand-dark">聯絡方式</h2>
          <div className="gold-divider mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto text-center">
            歡迎透過以下方式聯繫，說明需求後即可安排評估報價。
          </p>
        </div>

        {/* 第一排：電話 + Email + LINE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* 電話 */}
          <div className="bg-white border border-brand-gray-mid rounded-xl p-7
            hover:border-brand-gold/50 hover:shadow-md
            transition-all duration-300 group text-center">
            <div className="w-14 h-14 bg-brand-gold/8 border border-brand-gold/20 rounded-xl
              flex items-center justify-center mx-auto mb-5
              group-hover:bg-brand-gold/15 transition-all duration-300">
              <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h3 className="text-brand-dark font-semibold mb-1">電話</h3>
            <p className="text-brand-muted text-xs mb-4">{STUDIO.contactName}・適合快速洽詢</p>
            <a href={`tel:${STUDIO.phone.replace(/-/g, "")}`}
              className="block text-brand-gold hover:text-brand-gold-light
                text-lg font-bold tracking-wider transition-colors">
              {STUDIO.phone}
            </a>
            <a href={`tel:${STUDIO.phone.replace(/-/g, "")}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-brand-muted
                hover:text-brand-gold transition-colors">
              點擊撥打
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>

          {/* Email */}
          <div className="bg-white border border-brand-gray-mid rounded-xl p-7
            hover:border-brand-gold/50 hover:shadow-md
            transition-all duration-300 group text-center">
            <div className="w-14 h-14 bg-brand-gold/8 border border-brand-gold/20 rounded-xl
              flex items-center justify-center mx-auto mb-5
              group-hover:bg-brand-gold/15 transition-all duration-300">
              <svg className="w-7 h-7 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-brand-dark font-semibold mb-1">Email</h3>
            <p className="text-brand-muted text-xs mb-4">適合傳送資料、詳細需求說明</p>
            <a href={`mailto:${STUDIO.email}`}
              className="block text-brand-gold hover:text-brand-gold-light
                text-sm font-medium transition-colors break-all">
              {STUDIO.email}
            </a>
            <a href={`mailto:${STUDIO.email}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-brand-muted
                hover:text-brand-gold transition-colors">
              點擊寄信
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>

          {/* LINE */}
          <div className="bg-white border border-brand-gray-mid rounded-xl p-7
            hover:border-brand-gold/50 hover:shadow-md
            transition-all duration-300 group text-center">
            <div className="w-14 h-14 bg-brand-gold/8 border border-brand-gold/20 rounded-xl
              flex items-center justify-center mx-auto mb-5
              group-hover:bg-brand-gold/15 transition-all duration-300">
              <svg className="w-7 h-7 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
            </div>
            <h3 className="text-brand-dark font-semibold mb-1">LINE</h3>
            <p className="text-brand-muted text-xs mb-4">適合快速溝通、即時確認需求</p>
            <p className="text-brand-gold text-sm font-medium">{STUDIO.lineId}</p>
            <a href={STUDIO.lineUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-brand-muted
                hover:text-brand-gold transition-colors">
              加入好友
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 第二排：LINE QR Code + Facebook */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* LINE QR Code */}
          <div className="bg-white border border-brand-gray-mid rounded-xl p-7
            hover:border-brand-gold/50 hover:shadow-md
            transition-all duration-300 text-center">
            <h3 className="text-brand-dark font-semibold mb-1">LINE QR Code</h3>
            <p className="text-brand-muted text-xs mb-5">掃描 QR Code 直接加入 LINE 好友</p>
            <div className="w-40 h-40 mx-auto bg-white rounded-xl overflow-hidden
              flex items-center justify-center p-2 border border-brand-gray-mid">
              <Image
                src="/images/qr-line.png"
                alt="LINE QR Code - 加入 Jay Hu 工程文件工作室好友"
                width={144}
                height={144}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-brand-muted text-xs mt-3">使用 LINE App 掃描加入好友</p>
          </div>

          {/* Facebook */}
          <div className="bg-white border border-brand-gray-mid rounded-xl p-7
            hover:border-brand-gold/50 hover:shadow-md
            transition-all duration-300 group text-center flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-brand-gold/8 border border-brand-gold/20 rounded-xl
                flex items-center justify-center mx-auto mb-5
                group-hover:bg-brand-gold/15 transition-all duration-300">
                <svg className="w-7 h-7 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h3 className="text-brand-dark font-semibold mb-1">Facebook</h3>
              <p className="text-brand-muted text-xs mb-4">
                {STUDIO.fbNote}
              </p>
              <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-lg px-4 py-3 text-xs text-brand-blue/80 leading-relaxed">
                📊 不定期免費分享營造業文書輔助 <strong>VBA 工具</strong>，歡迎追蹤取用
              </div>
            </div>
            <a href={STUDIO.fbUrl} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-1.5
                text-xs text-brand-muted hover:text-brand-gold transition-colors">
              前往粉絲專頁
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 底部 CTA */}
        <div className="bg-white border-2 border-brand-gold/30 rounded-2xl p-8 lg:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(201,162,39,0.12) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
          <div className="relative">
            <h3 className="text-brand-dark text-xl font-bold mb-3">準備好開始詢價了嗎？</h3>
            <p className="text-brand-muted text-sm mb-6 max-w-lg mx-auto">
              填寫詢價表單，提供基本資料後即可收到報價評估。
              如有急件需求，也可先透過 LINE 說明狀況。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-gold px-8 py-3.5">
                填寫詢價表單
              </Link>
              <Link href={STUDIO.lineUrl} target="_blank" rel="noopener noreferrer"
                className="btn-outline-white px-8 py-3.5">
                LINE 快速聯繫
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
