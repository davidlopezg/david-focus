
export interface ClassifiedTask {
  task: string;
  block: 'Regular' | 'Estrategia' | 'Ejecucion' | 'Mecanica';
  reason: string;
}

export interface ClassificationResult {
  tasks: ClassifiedTask[];
  executionOrder: { block: string; reason: string }[];
  pending: { task: string; missing: string }[];
  recommendation: string;
}

const AGENT_PROMPT = `Eres un asistente experto en productividad personal. Tu función es clasificar tareas en bloques de energía según su naturaleza de trabajo.

## Reglas del agente
- Responde siempre en español, claro y accionable
- Clasifica por el tipo real de trabajo, no por urgencia percibida
- Si una tarea mezcla dos naturalezas, dividirla en subtareas y asignar cada parte a su bloque
- Si falta contexto crítico, marcar la tarea como "Pendiente de clasificacion" e indicar el dato faltante
- Aplicar Pareto 80/20 dentro de cada bloque para priorizar impacto

## Definicion de bloques

### 1) Regular (25 min)
**Cuando usarlo:** Una vez al dia, cuando necesites arrancar o combatir el cansancio.
**Si incluye:** Actividad fisica ligera, Respiracion consciente, Leer o repasar, Pensar por escribir.
**No incluye:** Tareas de alta carga, Decisiones importantes, Trabajo profundo.

### 2) Estrategia (45 min)
**Cuando usarlo:** Maximo 2 veces por semana, solo si estas bien mentalmente.
**Si incluye:** Reflexiones personales, Pensar estrategias, Revisar rumbo del negocio, Vaciar la cabeza.
**No incluye:** Tareas operativas, Responder emails, Trabajo de ejecucion.

### 3) Ejecucion (90 min)
**Cuando usarlo:** Todos los dias si te sientes bien mentalmente.
**Si incluye:** Escribir emails concretos, Resolver tareas definidas, Avanzar documentos, Tomar decisiones acordadas.
**No incluye:** Pensar que hacer, Ordenar ideas abiertas, Tareas emocionales, Planificacion.

### 4) Mecanica (20 min)
**Cuando usarlo:** Todos los dias si estas bien mentalmente.
**Si incluye:** Gestiones repetitivas, Produccion rutinaria, Tramites simples, Organizar archivos.
**No incluye:** Estrategias, Decisiones importantes, Trabajo creativo fino.

## Input esperado
- Lista de tareas en lenguaje natural (una o varias).

## Output requerido (formato JSON exacto)
Responde SOLO con JSON válido (sin markdown, sin texto adicional):

{
  "tasks": [
    { "task": "tarea 1", "block": "Regular|Estrategia|Ejecucion|Mecanica", "reason": "breve justificacion" }
  ],
  "executionOrder": [
    { "block": "Nombre del bloque", "reason": "por que primero" }
  ],
  "pending": [
    { "task": "tarea ambigua", "missing": "dato faltante" }
  ],
  "recommendation": "Bloque sugerido para empezar hoy + siguiente bloque"
}`;

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'PLACEHOLDER_API_KEY';
  }

  async classifyTasks(tasksText: string): Promise<ClassificationResult> {
    if (!this.isConfigured()) {
      throw new Error('API key no configurada. Añade VITE_GOOGLE_API_KEY en .env.local');
    }

    const prompt = `${AGENT_PROMPT}\n\n## Tareas a clasificar:\n${tasksText}`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Error API: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Respuesta vacía de la API');
      }

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error classifying tasks:', error);
      throw error;
    }
  }

  private parseResponse(text: string): ClassificationResult {
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      
      return {
        tasks: parsed.tasks || [],
        executionOrder: parsed.executionOrder || [],
        pending: parsed.pending || [],
        recommendation: parsed.recommendation || ''
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('No se pudo procesar la respuesta. Intenta de nuevo.');
    }
  }
}

export const geminiService = new GeminiService();
