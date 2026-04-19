const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LineItem {
  code: string | null;
  code_type: string | null;
  description: string;
  units: number;
  charged_amount: number;
  place_of_service: string | null;
}

export interface BillExtract {
  provider_name: string | null;
  provider_address: string | null;
  provider_npi: string | null;
  patient_name: string | null;
  date_of_service: string | null;
  account_number: string | null;
  insurance: string | null;
  line_items: LineItem[];
  total_charged: number | null;
}

export interface Anomaly {
  line_index: number;
  code: string | null;
  description: string;
  charged_amount: number;
  medicare_rate: number | null;
  multiplier: number | null;
  flag: string;
  estimated_savings: number;
}

export interface Analysis {
  anomalies: Anomaly[];
  total_charged: number;
  total_medicare: number;
  estimated_savings: number;
  line_count: number;
  flagged_count: number;
}

export interface LegalMatch {
  title: string;
  citation: string;
  why_it_applies: string;
  confidence: string;
  source_url?: string;
}

export interface RoadmapStep {
  title: string;
  detail: string;
  deadline: string;
  escalation: string;
}

export interface Letter {
  subject: string;
  body: string;
  recipient_block: string;
}

export interface PipelineResult {
  extract: BillExtract | null;
  analysis: Analysis | null;
  legal_matches: Record<string, LegalMatch[]> | null;
  letter: Letter | null;
  roadmap: RoadmapStep[] | null;
  summary: string | null;
  warnings: string[];
  cached: boolean;
  elapsed_seconds: number;
}

export async function runPipeline(file: File): Promise<PipelineResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/api/run`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server error: ${res.status}`);
  }

  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}
