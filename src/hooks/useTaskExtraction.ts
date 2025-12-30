import { useState } from 'react';
import { extractTasks } from '../utils/llmService';

export const useTaskExtraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);

  const extractTasksFromText = async (text: string) => {
    if (!text.trim()) {
      setError('Please enter some text to extract tasks from');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedTasks([]);

    try {
      const tasks = await extractTasks(text.trim());
      setExtractedTasks(tasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract tasks';
      setError(errorMessage);
      setExtractedTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearExtractedTasks = () => {
    setExtractedTasks([]);
    setError(null);
  };

  const removeTask = (index: number) => {
    setExtractedTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, newText: string) => {
    setExtractedTasks((prev) => {
      const updated = [...prev];
      updated[index] = newText.trim();
      return updated;
    });
  };

  return {
    isLoading,
    error,
    extractedTasks,
    extractTasksFromText,
    clearExtractedTasks,
    removeTask,
    updateTask,
  };
};

