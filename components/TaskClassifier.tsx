
import React, { useState } from 'react';
import { geminiService, ClassificationResult, ClassifiedTask } from '../services/gemini';
import { api } from '../services/api';

const BLOCK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Regular: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  Estrategia: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  Ejecucion: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  Mecanica: { bg: 'bg-slate-50 dark:bg-slate-700/20', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' },
};

const TaskClassifier: React.FC = () => {
  const [tasksInput, setTasksInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const handleClassify = async () => {
    if (!tasksInput.trim()) {
      setError('Por favor, introduce al menos una tarea.');
      return;
    }

    if (!geminiService.isConfigured()) {
      setError('API key no configurada. Añade tu GEMINI_API_KEY en .env.local');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const classificationResult = await geminiService.classifyTasks(tasksInput);
      setResult(classificationResult);

      await api.saveTaskClassification(tasksInput, JSON.stringify(classificationResult));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al clasificar tareas');
    } finally {
      setIsLoading(false);
    }
  };

  const getBlockColor = (block: string) => BLOCK_COLORS[block] || BLOCK_COLORS.Ejecucion;

  const renderTaskTable = () => {
    if (!result?.tasks.length) return null;

    const tasksByBlock = result.tasks.reduce((acc, task) => {
      if (!acc[task.block]) acc[task.block] = [];
      acc[task.block].push(task);
      return acc;
    }, {} as Record<string, ClassifiedTask[]>);

    const blockOrder = ['Regular', 'Estrategia', 'Ejecucion', 'Mecanica'];

    return (
      <div className="space-y-6">
        {blockOrder.map(block => {
          const blockTasks = tasksByBlock[block];
          if (!blockTasks?.length) return null;

          const colors = getBlockColor(block);
          return (
            <div key={block} className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}>
              <h3 className={`font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                <span className={`w-3 h-3 rounded-full ${
                  block === 'Regular' ? 'bg-green-500' :
                  block === 'Estrategia' ? 'bg-blue-500' :
                  block === 'Ejecucion' ? 'bg-yellow-500' : 'bg-slate-500'
                }`}></span>
                {block} ({blockTasks.length})
              </h3>
              <div className="space-y-2">
                {blockTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 mt-0.5">•</span>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{task.task}</span>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{task.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Clasificador de Tareas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Añade tus tareas y la IA las clasificará en bloques de energía
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lista de tareas (una por línea)
          </label>
          <textarea
            value={tasksInput}
            onChange={(e) => setTasksInput(e.target.value)}
            placeholder="Ej:
Meditar 10 minutos
Revisar rumbo del negocio Q2
Responder email a proveedor
Ordenar carpeta de facturas"
            className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleClassify}
            disabled={isLoading || !tasksInput.trim()}
            className="mt-4 w-full py-3 px-4 bg-primary hover:bg-primaryHover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Clasificando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_awesome</span>
                Clasificar Tareas
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in">
            {renderTaskTable()}

            {result.executionOrder.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">route</span>
                  Orden de ejecución recomendado
                </h2>
                <div className="space-y-3">
                  {result.executionOrder.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{item.block}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.pending.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined">help</span>
                  Pendientes de clasificación
                </h2>
                <ul className="space-y-2">
                  {result.pending.map((item, idx) => (
                    <li key={idx} className="text-sm text-amber-700 dark:text-amber-300">
                      <span className="font-medium">{item.task}</span> - Falta: {item.missing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendation && (
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                  Recomendación final
                </h2>
                <p className="text-gray-700 dark:text-gray-300">{result.recommendation}</p>
              </div>
            )}

            <button
              onClick={() => { setResult(null); setTasksInput(''); }}
              className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
            >
              Clasificar nuevas tareas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskClassifier;
