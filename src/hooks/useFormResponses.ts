import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FormResponse {
  id: string;
  created_at: string;
  top_effects: string[];
  relevance_digital_platforms: number | null;
  relevance_political_framework: number | null;
  relevance_data_transparency: number | null;
  relevance_proximity_economy: number | null;
  relevance_environmental_impact: number | null;
  relevance_right_to_city: number | null;
  proposal_idea: string | null;
  relevant_actors: string[];
  good_practices: string | null;
  processed: boolean;
}

export function useFormResponses() {
  const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

  const query = useQuery({
    queryKey: ["form-responses"],
    queryFn: async () => {
      if (!isConfigured) return [];
      const { data, error } = await supabase
        .from("form_responses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as FormResponse[]) ?? [];
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isConfigured) return;
    const channel = supabase
      .channel("form-responses-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "form_responses" }, () => {
        queryClient.invalidateQueries({ queryKey: ["form-responses"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient, isConfigured]);

  return query;
}
