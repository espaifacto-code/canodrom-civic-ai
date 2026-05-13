export interface Proposal {
  title: string;
  problem_summary: string;
  solution: string;
  implementation_steps: string[];
  stakeholders: string[];
  expected_impact_6m: string;
}

export interface ProposalScore {
  proposal_title: string;
  equity_score: number;
  sustainability_score: number;
  feasibility_score: number;
  community_support_score: number;
  summary?: string;
}

export interface EthicalIssue {
  id: string;
  area: string;
  severity: "low" | "medium" | "high" | "critical";
  detail: string;
}

export interface CivicRecord {
  id: string;
  created_at: string;
  issue: string | null;
  area: string | null;
  category: string | null;
  main_topic: string | null;
  participant: string | null;
  total_responses: number | null;
  priority_values: string[] | null;
  solution_types: string[] | null;
  proposals: Proposal[] | null;
  scores: ProposalScore[] | null;
  proposal_count: number | null;
  approved: boolean | null;
  ethical_issues: EthicalIssue[] | null;
  ethical_issues_count: number | null;
  status: string | null;
  top_effects: { name: string; count: number }[] | null;
  top_actors: { name: string; count: number }[] | null;
}
