import { PaginationAndOrderParams } from "@/lib/pagination";

export enum FaqRecipientsEnum {
  USER = "user",
  ADMIN = "admin",
  BOTH = "both",
}

export interface FaqRecipient {
  id: number;
  name: FaqRecipientsEnum;
  label: string;
  created_at: string;
  deleted_at?: string | null;
  updated_at: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  recipient_id: number;
  recipient: FaqRecipient;
  created_at: string;
  deleted_at?: string | null;
  updated_at: string;
}

export type FaqListParams = PaginationAndOrderParams<["id", "created_at"]>;
