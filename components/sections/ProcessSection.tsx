import Link from "next/link";
import { PROCESS_STEPS } from "@/lib/constants";

export default function ProcessSection() {
  return (
    <section id="process" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 標題 */}
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            How to Start
          </p>
          <h2 className="section-title text-brand-dark">詢價流程</h2>
          <div className="gold-divider mx-auto mt-4 mb-4" />
          <p className="section-subtitle mx-auto text-center">
            五個步驟完成委託，流程清楚透明，從詢價到正式作業一路明確。
          </p>
        </div>

        {/* 步驟時間軸 */}
        <div className="relative">
          {/* 桌機版連接線 */}
          <div
            className="hidden lg:block absolute top-8 left-0 right-0 h-0.5
              bg-gradient-to-r from-brand-gray-mid via-brand-gold/30 to-brand-gray-mid"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">

                {/* 步驟圓圈 */}
                <div
                  className="relative z-10 w-16 h-16 rounded-full
                    bg-white border-2 border-brand-gold
                    flex items-center justify-center mb-4
                    group-hover:bg-brand-gold transition-all duration-300 shadow-md"
                >
                  <span
                    className="text-brand-gold font-bold text-sm font-mono
                      group-hover:text-brand-dark transition-colors"
                  >
                    {step.step}
                  </span>
                </div>

                {/* 手機版連接線 */}
                {idx < PROCESS_STEPS.length - 1 && (
                  <div
                    className="lg:hidden absolute left-1/2 top-16 -translate-x-1/2
                      w-0.5 h-6 bg-brand-gold/30"
                    aria-hidden="true"
                  />
                )}

                <h3 className="text-brand-dark font-semibold text-sm mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-muted text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 詢價前提醒框 */}
        <div
          className="mt-14 bg-brand-gray border border-brand-gray-mid
            rounded-xl p-6 lg:p-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-gold/10
                flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-brand-gold" fill="none"
                stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-brand-dark font-semibold text-sm mb-3">
                詢價時請先提供以下基本資料，以便準確評估報價：
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {[
                  "工程名稱",
                  "工程性質（公路、橋樑、建築、水利等）",
                  "工程規模（如合約金額）",
                  "需求項目",
                  "預計完成時間",
                  "是否有既有版本或指定格式",
                  "公司名稱",
                  "聯絡窗口姓名與方式",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-brand-blue/80 text-sm">
                    <svg
                      className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5"
                      fill="currentColor" viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/quote" className="btn-gold px-10 py-4 text-base">
            前往填寫詢價表單
          </Link>
        </div>
      </div>
    </section>
  );
}
