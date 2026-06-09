import Link from "next/link";
import { SERVICES } from "@/lib/constants";

export default function ServicesSection() {
  return (
    <section id="services" className="bg-brand-gray py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 標題 */}
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            Services
          </p>
          <h2 className="section-title text-brand-dark">服務項目</h2>
          <div className="gold-divider mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto text-center">
            承接公共工程、土木營造各類文件整編，從計畫書撰寫到缺失改善資料，提供完整支援。
          </p>
        </div>

        {/* 影片展示 */}
        <div className="mb-14 rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto">
          <video
            className="w-full h-auto"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/showcase.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 服務卡片 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc) => (
            <div key={svc.id} className={`service-card group relative ${(svc as { customQuote?: boolean }).customQuote ? "border-brand-gold/40 bg-brand-gold/3" : ""}`}>
              {/* 另行洽談標籤 */}
              {(svc as { customQuote?: boolean }).customQuote && (
                <span className="absolute -top-3 right-4 bg-brand-gold text-brand-dark
                  text-xs font-bold px-2.5 py-0.5 rounded-full">
                  另行洽談
                </span>
              )}

              {/* 圖示 + 編號 */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl" role="img" aria-label={svc.title}>
                  {svc.icon}
                </span>
                <span className="text-brand-gray-mid text-xs font-mono font-medium
                  group-hover:text-brand-gold/50 transition-colors">
                  {String(svc.id).padStart(2, "0")}
                </span>
              </div>

              {/* 服務名稱 */}
              <h3 className="text-brand-dark font-semibold text-base mb-2
                group-hover:text-brand-navy transition-colors">
                {svc.title}
              </h3>

              {/* 說明文字 */}
              <p className="text-brand-muted text-sm leading-relaxed">
                {svc.desc}
              </p>

              {/* 底部連結 */}
              <div className="mt-4 pt-4 border-t border-brand-gray-mid
                group-hover:border-brand-gold/30 transition-colors">
                <Link
                  href={`/quote?service=${encodeURIComponent(svc.title)}`}
                  className="text-brand-gold text-xs font-medium hover:underline
                    flex items-center gap-1"
                >
                  {(svc as { customQuote?: boolean }).customQuote ? "聯繫洽談報價" : "詢問此項服務"}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="text-center mt-12">
          <p className="text-brand-muted text-sm mb-4">
            有其他文件整編需求？歡迎直接描述，我們可評估是否承接。
          </p>
          <Link href="/quote" className="btn-gold">
            前往填寫詢價表單
          </Link>
        </div>
      </div>
    </section>
  );
}
