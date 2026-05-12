export interface Proposal {
  title: string;
  problem_summary: string;
  solution: string;
  implementation_steps: string[];
  stakeholders: string[];
  expected_impact_6m: string;
}

export interface CivicRecord {
  id: string;
  created_at: string;
  issue: string | null;
  area: string | null;
  participant: string | null;
  proposal_count: number | null;
  avg_feasibility: number | null;
  avg_social_impact: number | null;
  avg_inclusivity: number | null;
  avg_sustainability: number | null;
  approved: boolean | null;
  ethical_issues_count: number | null;
  status: string | null;
  category: string | null;
  proposals: Proposal[] | null;
  scores: Record<string, number> | null;
  ethical_issues: string[] | null;
}
