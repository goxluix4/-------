import { WHY_US } from "@/lib/constants";

export default function WhyUsSection() {
  return (
    <section id="why-us" className="bg-white py-20 lg:py-28 relative overflow-hidden">

      {/* 背景點陣裝飾 */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(201,162,39,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 右上角角框裝飾 */}
      <div className="absolute right-8 top-8 opacity-20 pointer-events-none" aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 0 L80 32 M48 0 L80 0" stroke="#c9a227" strokeWidth="2"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 標題 */}
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="section-title text-brand-dark">為什麼選擇我</h2>
          <div className="gold-divider mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto text-center">
            工程文件的價值在於實用性，不在於好看。以下幾個重點是我與一般排版服務最大的差異。
          </p>
        </div>

        {/* 特點列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-brand-gray-mid rounded-xl p-6
                hover:border-brand-gold/60 hover:shadow-lg
                transition-all duration-300 group"
            >
              {/* 編號 */}
              <div className="absolute -top-3 left-5">
                <span className="inline-block bg-brand-gold text-brand-dark
                  text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-brand-dark font-semibold text-base mb-3 mt-2
                group-hover:text-brand-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                {item.desc}
              </p>

              {/* 底部金線 hover 效果 */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r
                from-brand-gold to-brand-gold-light rounded-b-xl
                group-hover:w-full transition-all duration-500" />
            </div>
          ))}

          {/* 最後一格：CTA 卡 */}
          <div className="relative bg-brand-gold/8 border-2 border-brand-gold/40
            rounded-xl p-6 flex flex-col justify-between
            hover:bg-brand-gold/12 hover:border-brand-gold transition-all duration-300">
            <div>
              <h3 className="text-brand-dark font-semibold text-base mb-3">
                對我們的服務有興趣？
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                歡迎透過 LINE 或 Email 聯繫，說明需求後即可安排評估報價。
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <a href="/quote" className="btn-gold text-sm py-2.5 w-full justify-center">
                立即詢價
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
