import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ManualTriggerProps {
  onTrigger?: (data: any) => void;
  onTriggerSuccess?: () => void;
}

export default function ManualTrigger({ onTrigger, onTriggerSuccess }: ManualTriggerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    issue: '',
    location: '',
    description: '',
    affected_groups: '',
    priorities: '',
    community_assets: '',
    ethical_redlines: '',
    desired_solution_types: '',
    consent_given: false,
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent_given) {
      toast({
        title: "Consent Required",
        description: "Please provide consent before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const responses = [
        { question: "What should we call you?", answer: "Dashboard User" },
        { question: "Email (optional)", answer: "" },
        { question: "Which neighborhood or area are you talking about?", answer: formData.location },
        { question: "What is your connection to this area?", answer: "Local resident" },
        { question: "How often are you in this area?", answer: "Daily" },
        { question: "What is the main issue or challenge in this neighborhood or public space?", answer: formData.description },
        { question: "Who is most affected by this issue?", answer: formData.affected_groups ? formData.affected_groups.split(',').map(s => s.trim()) : [] },
        { question: "How serious is this issue for you?", answer: 8 },
        { question: "What do you think is causing this issue?", answer: formData.issue || "urban development pressures" },
        { question: "Which values should be prioritized most in this area?", answer: formData.priorities ? formData.priorities.split(',').map(s => s.trim()) : ["sustainability", "community"] },
        { question: "What would a fair solution look like here?", answer: "Inclusive and sustainable" },
        { question: "What resources, strengths, or community assets already exist here?", answer: formData.community_assets },
        { question: "What should definitely not happen in any future solution?", answer: formData.ethical_redlines },
        { question: "What kinds of solutions would you like to see? Choose all that apply.", answer: formData.desired_solution_types ? formData.desired_solution_types.split(',').map(s => s.trim()) : [] },
      ];

      const payload = {
        data: {
          responses,
          consent_given: formData.consent_given,
        },
        source: 'dashboard_manual_trigger',
        project_id: `manual-${Date.now()}`,
        pilot_topic: formData.issue || "civic participation",
      };

      try {
        const { data: result, error } = await supabase.functions.invoke('manual-trigger', {
          body: payload,
        });

        if (error) {
          throw error;
        }

        if (result?.ok) {
          setStatus('success');
          toast({
            title: "Workflow Triggered",
            description: "The civic AI pipeline has been started. Check the dashboard for results.",
          });
          onTrigger?.({ ...formData, result: result.result });
          onTriggerSuccess?.();
        } else {
          setStatus('error');
          toast({
            title: "Trigger Failed",
            description:
              (result && (result.error || result.result?.error || result.result?.message))
                ? String(result.error || result.result?.error || result.result?.message)
                : "There was an error triggering the workflow.",
            variant: "destructive",
          });
        }
      } catch (err) {
        setStatus('error');
        setIsLoading(false);
        toast({
          title: "Trigger Error",
          description:
            (err instanceof Error ? err.message : String(err)) +
            "\nCheck the Supabase function deployment and N8N_WEBHOOK_URL secret.",
          variant: "destructive",
        });
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Manual Workflow Trigger
        </CardTitle>
        <CardDescription>
          Use this form to send a sample civic issue through the system and create a test submission in the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Issue Category</Label>
              <Select value={formData.issue} onValueChange={(value) => handleInputChange('issue', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="community">Community Safety</SelectItem>
                  <SelectItem value="economy">Local Economy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Barcelona, Gràcia district"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Issue Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the civic issue or challenge..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="affected_groups">Affected Groups</Label>
              <Input
                id="affected_groups"
                placeholder="e.g., elderly, families, youth"
                value={formData.affected_groups}
                onChange={(e) => handleInputChange('affected_groups', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorities">Community Priorities</Label>
              <Input
                id="priorities"
                placeholder="e.g., affordability, accessibility, sustainability"
                value={formData.priorities}
                onChange={(e) => handleInputChange('priorities', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="community_assets">Community Assets & Resources</Label>
            <Textarea
              id="community_assets"
              placeholder="Existing community resources, organizations, or infrastructure..."
              value={formData.community_assets}
              onChange={(e) => handleInputChange('community_assets', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ethical_redlines">Ethical Red Lines</Label>
            <Textarea
              id="ethical_redlines"
              placeholder="What should NOT be considered in solutions?"
              value={formData.ethical_redlines}
              onChange={(e) => handleInputChange('ethical_redlines', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desired_solution_types">Desired Solution Types</Label>
            <Input
              id="desired_solution_types"
              placeholder="e.g., policy, community programs, infrastructure"
              value={formData.desired_solution_types}
              onChange={(e) => handleInputChange('desired_solution_types', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent_given}
              onCheckedChange={(checked) => handleInputChange('consent_given', checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm">
              I consent to processing this information through the civic AI pipeline for public benefit.
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isLoading ? 'Triggering...' : 'Trigger Workflow'}
            </Button>

            {status === 'success' && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Triggered Successfully
              </Badge>
            )}

            {status === 'error' && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Trigger Failed
              </Badge>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
