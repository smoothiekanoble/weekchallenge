/**
 * LLM Service for extracting tasks from natural language
 * Uses Groq API (free tier, open-source models)
 */

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant'; // Fast, free tier model

/**
 * Extract tasks from natural language input using LLM
 */
export async function extractTasks(userInput: string): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Groq API key not found. Please set VITE_GROQ_API_KEY in your .env file. Get a free key at https://console.groq.com'
    );
  }

  const prompt = `You are a task extraction assistant. Extract actionable tasks from the following text.
Return ONLY a valid JSON array of task strings, no explanations, no markdown, no code blocks.
Each task should be clear, concise, and actionable.
If the input is already a list of tasks, extract them as-is.
If the input describes activities, break them into individual tasks.

Example output format: ["Task 1", "Task 2", "Task 3"]

Input text: "${userInput}"

Return only the JSON array:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts tasks from text. Always return a valid JSON array of strings.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: GroqResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const content = data.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('No response from API');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content;
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    cleanedContent = cleanedContent.trim();

    // Parse JSON array
    try {
      const tasks = JSON.parse(cleanedContent);
      
      if (!Array.isArray(tasks)) {
        throw new Error('Response is not an array');
      }

      // Filter and clean tasks
      const extractedTasks = tasks
        .map((task) => {
          if (typeof task === 'string') {
            return task.trim();
          }
          return String(task).trim();
        })
        .filter((task) => task.length > 0);

      if (extractedTasks.length === 0) {
        throw new Error('No tasks could be extracted from the input');
      }

      return extractedTasks;
    } catch (parseError) {
      // Fallback: try to extract tasks from plain text if JSON parsing fails
      const lines = cleanedContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('[') && !line.startsWith(']'));

      if (lines.length > 0) {
        // Try to extract from numbered or bulleted list
        const tasks = lines
          .map((line) => {
            // Remove numbering (1., 2., etc.) or bullets (-, *, etc.)
            return line.replace(/^[\d\-*•]\s*/, '').replace(/^-\s*/, '').trim();
          })
          .filter((task) => task.length > 0);

        if (tasks.length > 0) {
          return tasks;
        }
      }

      throw new Error(
        `Failed to parse tasks from response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context
      if (error.message.includes('API key')) {
        throw error;
      }
      throw new Error(`Task extraction failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred during task extraction');
  }
}

