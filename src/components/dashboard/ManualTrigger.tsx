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
  compact?: boolean;
}

export default function ManualTrigger({ onTrigger, onTriggerSuccess, compact }: ManualTriggerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    issue: '',
    location: 'Barcelona',
    description: '',
    affected_groups: '',
    priorities: '',
    community_assets: '',
    ethical_redlines: '',
    desired_solution_types: '',
    consent_given: false,
  });

  const { toast } = useToast();

  const triggerWorkflow = async (data: typeof formData) => {
    const responses = [
      { question: "What should we call you?", answer: "Workshop Canodrom" },
      { question: "Which neighborhood or area?", answer: data.location || "Barcelona" },
      { question: "What is the main issue?", answer: data.description || "Turismo masivo en Barcelona" },
      { question: "Who is most affected?", answer: data.affected_groups ? data.affected_groups.split(',').map(s => s.trim()) : ["residents", "neighbours"] },
      { question: "What do you think is causing this issue?", answer: data.issue || "mass tourism" },
      { question: "Which values should be prioritized?", answer: data.priorities ? data.priorities.split(',').map(s => s.trim()) : ["right to the city", "community", "identity"] },
      { question: "What resources exist?", answer: data.community_assets || "Canodrom, neighbourhood associations" },
      { question: "What should NOT be in solutions?", answer: data.ethical_redlines || "" },
      { question: "Solution types desired?", answer: data.desired_solution_types ? data.desired_solution_types.split(',').map(s => s.trim()) : ["policy", "community programs"] },
    ];

    const payload = {
      data: { responses, consent_given: true },
      source: 'workshop_canodrom',
      project_id: `canodrom-${Date.now()}`,
      pilot_topic: "turismo masivo Barcelona",
    };

    try {
      const { data: result, error } = await supabase.functions.invoke('manual-trigger', {
        body: payload,
      });

      if (error) throw error;

      if (result?.ok) {
        setStatus('success');
        toast({
          title: "Pipeline iniciado",
          description: "El pipeline de IA ha comenzado. Los resultados aparecerán en el dashboard.",
        });
        onTrigger?.({ ...data, result: result.result });
        onTriggerSuccess?.();
      } else {
        setStatus('error');
        toast({
          title: "Error al iniciar",
          description: (result && (result.error || result.result?.error || result.result?.message))
            ? String(result.error || result.result?.error || result.result?.message)
            : "Error al iniciar el workflow.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setStatus('error');
      toast({
        title: "Error de conexión",
        description: (err instanceof Error ? err.message : String(err)) +
          "\nRevisa la Supabase function y el secreto N8N_WEBHOOK_URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runPipeline = async () => {
    setIsLoading(true);
    setStatus('idle');
    await triggerWorkflow(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent_given) {
      toast({
        title: "Consentimiento requerido",
        description: "Marca el consentimiento antes de enviar.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setStatus('idle');
    await triggerWorkflow(formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={runPipeline}
          disabled={isLoading}
          size="lg"
          className="h-16 px-8 text-base font-bold rounded-xl gap-3 text-white border-0"
          style={{
            background: isLoading ? undefined : "linear-gradient(135deg,#2563eb,#0891b2)",
            boxShadow: "0 4px 24px rgba(37,99,235,.35)",
          }}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
          {isLoading ? 'Procesando...' : '¡Iniciar pipeline!'}
        </Button>
        <p className="text-xs text-muted-foreground text-center max-w-[160px]">
          Pulsa cuando todos hayan enviado el formulario
        </p>
        {status === 'success' && (
          <Badge variant="default" className="flex items-center gap-1 bg-emerald-500">
            <CheckCircle className="h-3 w-3" /> Pipeline iniciado
          </Badge>
        )}
        {status === 'error' && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Error
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Trigger manual del workflow
        </CardTitle>
        <CardDescription>
          Envía una entrada de prueba al pipeline de IA del Workshop Canodrom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Categoría del problema</Label>
              <Select value={formData.issue} onValueChange={(value) => handleInputChange('issue', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vivienda">Vivienda</SelectItem>
                  <SelectItem value="espacio-publico">Espacio público</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="identidad">Identidad</SelectItem>
                  <SelectItem value="comercio-local">Comercio local</SelectItem>
                  <SelectItem value="ruido">Ruido / Convivencia</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="derecho-ciudad">Derecho a la ciudad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Barrio / Zona</Label>
              <Input
                id="location"
                placeholder="e.g., Barceloneta, Gràcia, Raval"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del problema</Label>
            <Textarea
              id="description"
              placeholder="¿Qué problema o desafío quieres abordar?"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="affected_groups">Grupos afectados</Label>
              <Input
                id="affected_groups"
                placeholder="e.g., vecinos, comerciantes, jóvenes"
                value={formData.affected_groups}
                onChange={(e) => handleInputChange('affected_groups', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorities">Prioridades</Label>
              <Input
                id="priorities"
                placeholder="e.g., vivienda asequible, identidad, convivencia"
                value={formData.priorities}
                onChange={(e) => handleInputChange('priorities', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="community_assets">Recursos o iniciativas existentes</Label>
            <Textarea
              id="community_assets"
              placeholder="Asociaciones, espacios, proyectos que ya existen..."
              value={formData.community_assets}
              onChange={(e) => handleInputChange('community_assets', e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent_given}
              onCheckedChange={(checked) => handleInputChange('consent_given', checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm">
              Doy consentimiento para procesar esta información a través del pipeline de IA cívica.
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isLoading ? 'Procesando...' : 'Iniciar workflow'}
            </Button>

            {status === 'success' && (
              <Badge variant="default" className="flex items-center gap-1 bg-emerald-500">
                <CheckCircle className="h-3 w-3" /> Iniciado correctamente
              </Badge>
            )}
            {status === 'error' && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Error
              </Badge>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
