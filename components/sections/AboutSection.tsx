import { STUDIO } from "@/lib/constants";

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* 左側：文字說明 */}
          <div>
            <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
              About Studio
            </p>
            <h2 className="section-title mb-4">
              關於<br />
              <span className="text-brand-navy">Jay Hu 工程文件工作室</span>
            </h2>
            <div className="gold-divider mb-6" />

            <div className="space-y-4 text-brand-blue/80 leading-relaxed">
              <p>
                本工作室專注於<strong className="text-brand-navy">公共工程與土木營造的文件整編支援</strong>，
                承接對象包含工程承攬廠商、營造公司、技師事務所與顧問公司。
              </p>
              <p>
                文件整編的核心在於<strong className="text-brand-navy">工程邏輯與實務流程</strong>，
                不是單純的文字排版。每一份文件都需要符合送審、查核、缺失改善的實際需求，
                能用、能交、能整理清楚。
              </p>
              <p>
                熟悉公共工程施工計畫書、品質計畫書、職業安全衛生管理計畫書等文件架構，
                了解監造單位與主管機關的審查邏輯，可依廠商既有版本進行修正優化，
                也可依格式規範從頭整編。
              </p>
              <p>
                如有短期補位、急件需求，或工地內業積壓等情況，歡迎來信或 LINE 討論，
                評估後提供明確報價。
              </p>
            </div>
          </div>

          {/* 右側：特色卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                ),
                title: "工程實務導向",
                desc: "以工程邏輯整編，不只是排版，確保文件能交、能審、能用。",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                title: "可接急件與補位",
                desc: "了解工程時程壓力，可評估急件可行性，協助解決內業積壓問題。",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                ),
                title: "可依既有版本修正",
                desc: "接受廠商現行文件版本，針對問題點修正優化，無需從零開始。",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                ),
                title: "服務多元工程類型",
                desc: "公路、橋樑、建築、水利、管線等各類工程均可承接文件整編支援。",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-brand-gray rounded-xl p-5 border border-brand-gray-mid
                  hover:border-brand-gold/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-brand-navy/10 rounded-lg flex items-center
                  justify-center text-brand-navy group-hover:bg-brand-gold/10
                  group-hover:text-brand-gold transition-all duration-300 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-brand-dark text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="text-brand-muted text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
