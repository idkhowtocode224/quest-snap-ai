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
      // For MVP, we'll use a mock API call
      // In production, this would call your search API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock results for demonstration
      const mockResults: SearchResult[] = [
        {
          title: "Understanding " + query + " - Complete Guide",
          snippet: "This comprehensive guide covers everything you need to know about " + query + ". Learn the fundamentals, best practices, and advanced techniques from industry experts.",
          url: "https://example.com/guide",
          source: "example.com"
        },
        {
          title: "Top 10 Facts About " + query,
          snippet: "Discover fascinating facts and insights about " + query + ". Our research team has compiled the most important information you should know.",
          url: "https://research.com/facts",
          source: "research.com"
        },
        {
          title: query + " Explained Simply",
          snippet: "A simple, easy-to-understand explanation of " + query + " that anyone can follow. Perfect for beginners and those looking for a quick overview.",
          url: "https://simple.guide/" + query.toLowerCase(),
          source: "simple.guide"
        }
      ];

      const mockAnswer = `Based on the search results, ${query} is a multifaceted topic with several key aspects. The available information suggests it's an important subject that benefits from comprehensive understanding and practical application.`;

      setResults(mockResults);
      setAnswer(mockAnswer);
    } catch (err) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
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