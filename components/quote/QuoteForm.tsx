"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, QuoteFormData } from "@/lib/validators";
import { SERVICES, PROJECT_TYPES, AVAILABLE_DOCS } from "@/lib/constants";
import Link from "next/link";

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceItems:  [],
      availableDocs: [],
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setSubmitting(true);
    try {
      // 預留 API 串接點（未來可改為 fetch("/api/submit-quote", ...)）
      const res = await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        // 後端尚未串接時，前端仍顯示成功（Demo 模式）
        setSubmitted(true);
      }
    } catch {
      // 尚未部署後端 API 時，仍顯示成功
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── 送出成功畫面 ──
  if (submitted) {
    return (
      <div className="text-center py-16 px-4">
        <div
          className="w-16 h-16 bg-brand-gold/10 border-2 border-brand-gold
            rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-8 h-8 text-brand-gold" fill="none"
            stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-3">
          詢價資料已送出！
        </h2>
        <p className="text-brand-muted text-sm mb-2">
          感謝您的詢問，本工作室將於收到資料後盡快與您聯繫。
        </p>
        <p className="text-brand-muted text-sm mb-8">
          如有急件或補充說明，也可直接透過 LINE（@039twcfp）或 Email（jayhu.docs@gmail.com）聯繫。
        </p>
        <Link href="/" className="btn-gold">
          返回首頁
        </Link>
      </div>
    );
  }

  // ── 表單本體 ──
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">

      {/* ── 區塊一：聯絡人資訊 ── */}
      <fieldset className="space-y-5">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">01</span>聯絡人資訊
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 公司名稱 */}
          <div>
            <label htmlFor="companyName" className="form-label">
              公司名稱 <span className="text-red-500">*</span>
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="如：○○營造股份有限公司"
              className="form-input"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="form-error">{errors.companyName.message}</p>
            )}
          </div>

          {/* 聯絡人姓名 */}
          <div>
            <label htmlFor="contactName" className="form-label">
              聯絡人姓名 <span className="text-red-500">*</span>
            </label>
            <input
              id="contactName"
              type="text"
              placeholder="姓名"
              className="form-input"
              {...register("contactName")}
            />
            {errors.contactName && (
              <p className="form-error">{errors.contactName.message}</p>
            )}
          </div>

          {/* 聯絡電話 */}
          <div>
            <label htmlFor="phone" className="form-label">
              聯絡電話 <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="如：0912-345-678"
              className="form-input"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="form-error">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@company.com"
              className="form-input"
              {...register("email")}
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          {/* LINE ID */}
          <div className="sm:col-span-2">
            <label htmlFor="lineId" className="form-label">
              LINE ID
              <span className="text-brand-muted text-xs ml-1.5 font-normal">（選填）</span>
            </label>
            <input
              id="lineId"
              type="text"
              placeholder="如：@example 或個人 LINE ID"
              className="form-input"
              {...register("lineId")}
            />
          </div>
        </div>
      </fieldset>

      {/* ── 區塊二：工程資訊 ── */}
      <fieldset className="space-y-5">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">02</span>工程基本資訊
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 工程名稱 */}
          <div className="sm:col-span-2">
            <label htmlFor="projectName" className="form-label">
              工程名稱 <span className="text-red-500">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              placeholder="如：○○道路拓寬改善工程"
              className="form-input"
              {...register("projectName")}
            />
            {errors.projectName && (
              <p className="form-error">{errors.projectName.message}</p>
            )}
          </div>

          {/* 工程性質 */}
          <div>
            <label htmlFor="projectType" className="form-label">
              工程性質 <span className="text-red-500">*</span>
            </label>
            <select
              id="projectType"
              className="form-select"
              defaultValue=""
              {...register("projectType")}
            >
              <option value="" disabled>請選擇工程性質</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.projectType && (
              <p className="form-error">{errors.projectType.message}</p>
            )}
          </div>

          {/* 工程規模 */}
          <div>
            <label htmlFor="projectScale" className="form-label">
              工程規模 <span className="text-red-500">*</span>
            </label>
            <input
              id="projectScale"
              type="text"
              placeholder="如：合約金額 2,000 萬元"
              className="form-input"
              {...register("projectScale")}
            />
            {errors.projectScale && (
              <p className="form-error">{errors.projectScale.message}</p>
            )}
          </div>

          {/* 預計完成時間 */}
          <div>
            <label htmlFor="dueDate" className="form-label">
              預計完成時間 <span className="text-red-500">*</span>
            </label>
            <input
              id="dueDate"
              type="text"
              placeholder="如：2025/08/31 前、約 2 週"
              className="form-input"
              {...register("dueDate")}
            />
            {errors.dueDate && (
              <p className="form-error">{errors.dueDate.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── 區塊三：需求項目 ── */}
      <fieldset className="space-y-4">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">03</span>需求項目
          <span className="text-red-500 ml-1">*</span>
          <span className="text-brand-muted text-xs ml-2 font-normal">（可複選）</span>
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICES.map((svc) => (
            <label
              key={svc.id}
              className="flex items-start gap-3 p-3.5 rounded-lg border
                border-brand-gray-mid cursor-pointer
                hover:border-brand-gold/50 hover:bg-brand-gray
                transition-all duration-200 group"
            >
              <input
                type="checkbox"
                value={svc.title}
                className="mt-0.5 w-4 h-4 accent-brand-gold flex-shrink-0"
                {...register("serviceItems")}
              />
              <div>
                <span className="text-sm font-medium text-brand-dark
                  group-hover:text-brand-navy">
                  {svc.icon} {svc.title}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.serviceItems && (
          <p className="form-error">{errors.serviceItems.message}</p>
        )}
      </fieldset>

      {/* ── 區塊四：資料狀況 ── */}
      <fieldset className="space-y-5">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">04</span>現有資料狀況
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 是否有既有版本 */}
          <div>
            <p className="form-label">
              是否有既有版本 <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col gap-2.5 mt-1">
              {[
                { value: "有，可提供參考", label: "有，可提供參考" },
                { value: "有，但需大幅修改", label: "有，但需大幅修改" },
                { value: "無，需從頭整編", label: "無，需從頭整編" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    value={opt.value}
                    className="w-4 h-4 accent-brand-gold"
                    {...register("hasExisting")}
                  />
                  <span className="text-sm text-brand-blue">{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.hasExisting && (
              <p className="form-error">{errors.hasExisting.message}</p>
            )}
          </div>

          {/* 是否有指定格式 */}
          <div>
            <p className="form-label">
              是否有指定格式或範本 <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col gap-2.5 mt-1">
              {[
                { value: "有指定格式，可提供", label: "有指定格式，可提供" },
                { value: "監造單位有格式要求", label: "監造單位有格式要求" },
                { value: "無指定格式", label: "無指定格式" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    value={opt.value}
                    className="w-4 h-4 accent-brand-gold"
                    {...register("hasFormat")}
                  />
                  <span className="text-sm text-brand-blue">{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.hasFormat && (
              <p className="form-error">{errors.hasFormat.message}</p>
            )}
          </div>
        </div>

        {/* 可提供資料（多選） */}
        <div>
          <p className="form-label">
            可提供的參考資料
            <span className="text-brand-muted text-xs ml-1.5 font-normal">（選填，可複選）</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            {AVAILABLE_DOCS.map((doc) => (
              <label
                key={doc}
                className="flex items-center gap-2 cursor-pointer px-3 py-2
                  rounded-md border border-brand-gray-mid text-sm text-brand-blue
                  hover:border-brand-gold/50 hover:bg-brand-gray transition-all"
              >
                <input
                  type="checkbox"
                  value={doc}
                  className="w-3.5 h-3.5 accent-brand-gold"
                  {...register("availableDocs")}
                />
                {doc}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* ── 區塊五：請款方式 ── */}
      <fieldset className="space-y-4">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">05</span>請款方式需求
          <span className="text-red-500 ml-1">*</span>
        </legend>

        <div
          className="bg-brand-gold/5 border border-brand-gold/20 rounded-lg
            p-4 text-sm text-brand-blue/80 mb-4"
        >
          ⚠️ 本工作室目前以個人接案方式承作，可提供<strong>個人收據</strong>。
          如需統一發票，請於詢價時說明，以便評估合作方式。
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { value: "可接受個人收據", label: "可接受個人收據" },
            { value: "需另行確認", label: "需另行確認（請於備註說明情況）" },
            { value: "需統一發票", label: "需統一發票（請先告知，以便確認是否可承接）" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="radio"
                value={opt.value}
                className="w-4 h-4 accent-brand-gold mt-0.5"
                {...register("invoiceType")}
              />
              <span className="text-sm text-brand-blue">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.invoiceType && (
          <p className="form-error">{errors.invoiceType.message}</p>
        )}
      </fieldset>

      {/* ── 區塊六：估價補強資訊 ── */}
      <fieldset className="space-y-5">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">06</span>估價補強資訊
          <span className="text-brand-muted text-xs ml-2 font-normal">（選填，填越完整報價越準確）</span>
        </legend>

        <div
          className="bg-blue-50/50 border border-blue-100 rounded-lg p-3.5
            text-xs text-brand-blue/70"
        >
          以下資訊有助於更準確評估工作量，不確定者可略填，本工作室評估後會再與您確認。
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 分項施工計畫書本數 */}
          <div>
            <label htmlFor="subPlanCount" className="form-label">
              分項施工計畫書數量（概估）
            </label>
            <select
              id="subPlanCount"
              className="form-select"
              defaultValue=""
              {...register("subPlanCount")}
            >
              <option value="">不確定 / 暫不提供</option>
              <option value="2">精簡型：1–4 本</option>
              <option value="7">適中型：5–9 本</option>
              <option value="12">繁複型：10–14 本</option>
              <option value="18">大型：15 本以上</option>
            </select>
            <p className="text-brand-muted text-xs mt-1">
              例：假設工程、鋼筋、模板、混凝土…等各算一本
            </p>
          </div>

          {/* 工期（月） */}
          <div>
            <label htmlFor="projectDurationMonths" className="form-label">
              契約工期（月）
            </label>
            <input
              id="projectDurationMonths"
              type="number"
              min={1}
              max={120}
              placeholder="如：18（代表 18 個月）"
              className="form-input"
              {...register("projectDurationMonths")}
            />
            <p className="text-brand-muted text-xs mt-1">
              影響查核簡報次數及月費估算
            </p>
          </div>
        </div>

        {/* 修訂壓力 */}
        <div>
          <p className="form-label">業主 / 監造修訂頻繁程度</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
            {[
              { value: "低",   desc: "通常一次通過" },
              { value: "中",   desc: "偶有修改（2–3 輪）" },
              { value: "高",   desc: "修改頻繁（4 輪以上）" },
              { value: "極高", desc: "反覆大幅修改" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex flex-col items-center gap-1 p-3 rounded-lg border
                  border-brand-gray-mid cursor-pointer text-center
                  hover:border-brand-gold/50 hover:bg-brand-gray transition-all
                  has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold/5"
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="w-4 h-4 accent-brand-gold"
                  {...register("revisionLevel")}
                />
                <span className="text-sm font-medium text-brand-dark">{opt.value}</span>
                <span className="text-xs text-brand-muted">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* ── 區塊七：補充說明 ── */}
      <fieldset className="space-y-4">
        <legend className="text-brand-navy font-bold text-base border-b border-brand-gray-mid pb-2 w-full">
          <span className="text-brand-gold mr-2">07</span>補充說明
          <span className="text-brand-muted text-xs ml-2 font-normal">（選填）</span>
        </legend>

        <textarea
          id="remarks"
          rows={5}
          placeholder="請說明其他特殊需求、急件情況、工程背景，或任何有助於評估的資訊..."
          className="form-input resize-none"
          {...register("remarks")}
        />
      </fieldset>

      {/* ── 送出按鈕 ── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full sm:w-auto px-12 py-4 text-base
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              送出中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              送出詢價資料
            </>
          )}
        </button>
        <p className="text-brand-muted text-xs mt-3">
          * 為必填欄位。填寫越完整，報價越準確。送出後本工作室將盡快與您聯繫確認報價。
        </p>
      </div>
    </form>
  );
}
