import { z } from "zod";

export const quoteSchema = z.object({
  companyName:   z.string().min(1, "請填寫公司名稱"),
  contactName:   z.string().min(1, "請填寫聯絡人姓名"),
  phone:         z.string().min(8, "請填寫有效聯絡電話"),
  email:         z.string().email("請填寫有效 Email"),
  lineId:        z.string().optional(),
  projectName:   z.string().min(1, "請填寫工程名稱"),
  projectType:   z.string().min(1, "請選擇工程性質"),
  projectScale:  z.string().min(1, "請填寫工程規模（如合約金額）"),
  serviceItems:  z.array(z.string()).min(1, "請至少選擇一項需求項目"),
  dueDate:       z.string().min(1, "請填寫預計完成時間"),
  hasExisting:   z.string().min(1, "請選擇是否有既有版本"),
  hasFormat:     z.string().min(1, "請選擇是否有指定格式"),
  availableDocs: z.array(z.string()).optional(),
  invoiceType:   z.string().min(1, "請選擇請款方式需求"),
  remarks:       z.string().optional(),
  // 估價補強欄位（選填，填越完整報價越準確）
  subPlanCount:          z.preprocess(
    (v) => (!v || v === "") ? undefined : Number(v),
    z.number().int().min(1).max(30).optional()
  ),
  projectDurationMonths: z.preprocess(
    (v) => (!v || v === "") ? undefined : Number(v),
    z.number().int().min(1).max(120).optional()
  ),
  revisionLevel: z.enum(["低", "中", "高", "極高"]).optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
