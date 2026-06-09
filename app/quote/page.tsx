import type { Metadata } from "next";
import Link from "next/link";
import QuoteForm from "@/components/quote/QuoteForm";
import { STUDIO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "線上詢價表單｜Jay Hu 工程文件工作室",
  description:
    "填寫詢價表單，提供工程基本資料，本工作室將盡快回覆報價評估。承接施工計畫書、送審資料、查核簡報、缺失改善等文件整編服務。",
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-brand-gray pt-16">

      {/* ── 頁首 Hero ── */}
      <div className="bg-white border-b border-brand-gold/20 py-14 lg:py-18 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(201,162,39,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-sm font-medium tracking-widest uppercase mb-3">
            Quote Request
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
            線上詢價表單
          </h1>
          <div className="gold-divider mx-auto mb-4" />
          <p className="text-brand-muted text-sm max-w-xl mx-auto">
            請填寫以下基本資料，本工作室將評估後提供報價。
            資料填寫越完整，報價越準確。
          </p>

          {/* 麵包屑 */}
          <nav className="flex justify-center gap-1.5 mt-6 text-xs text-brand-muted/60">
            <Link href="/" className="hover:text-brand-gold transition-colors">首頁</Link>
            <span>/</span>
            <span className="text-brand-muted">線上詢價</span>
          </nav>
        </div>
      </div>

      {/* ── 表單主體 ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray-mid p-6 sm:p-10">
          <QuoteForm />
        </div>

        {/* 聯絡提示 */}
        <div
          className="mt-8 bg-brand-navy/5 border border-brand-navy/10 rounded-xl
            p-5 text-center"
        >
          <p className="text-brand-blue/70 text-sm">
            如有急件需求或填表前想先確認，歡迎直接透過
            <a
              href={STUDIO.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold hover:underline mx-1 font-medium"
            >
              LINE（{STUDIO.lineId}）
            </a>
            或
            <a
              href={`mailto:${STUDIO.email}`}
              className="text-brand-gold hover:underline mx-1 font-medium"
            >
              Email
            </a>
            聯繫。
          </p>
        </div>
      </div>
    </div>
  );
}
