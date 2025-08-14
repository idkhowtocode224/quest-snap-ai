import { useState } from "react";
import { SearchResult } from "@/components/SearchResults";

interface SearchResponse {
  results: SearchResult[];
  answer?: string;
}

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState<string>();
  const [error, setError] = useState<string>();

  const search = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(undefined);
    setResults([]);
    setAnswer(undefined);

    try {
      // Step 1: Search the web for real results using our backend
      console.log("Searching web for:", query);
      
      const searchResponse = await fetch('/functions/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to search');
      }

      const data = await searchResponse.json();
      
      setResults(data.results || []);
      setAnswer(data.answer || "I couldn't find specific information about that. Please try rephrasing your question.");

    } catch (err) {
      console.error("Search error:", err);
      
      // Fallback to basic responses if API fails
      let fallbackAnswer = "";
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('what is') && /[\+\-\*\/\d]/.test(query)) {
        try {
          const mathExpression = query.replace(/what is/i, '').trim();
          if (/^[\d\+\-\*\/\.\(\)\s]+$/.test(mathExpression)) {
            const result = eval(mathExpression);
            fallbackAnswer = `The answer is ${result}.`;
          }
        } catch (e) {
          fallbackAnswer = "I can help with basic math calculations. Please provide a clear mathematical expression.";
        }
      } else if (lowerQuery.includes('time') || lowerQuery.includes('date')) {
        const now = new Date();
        fallbackAnswer = `The current time is ${now.toLocaleTimeString()} and today's date is ${now.toLocaleDateString()}.`;
      } else {
        fallbackAnswer = "I'm having trouble connecting to search services right now. Please try again in a moment.";
      }
      
      setAnswer(fallbackAnswer);
      setError("Search services temporarily unavailable. Basic functionality still works.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    isLoading,
    results,
    answer,
    error
  };
};