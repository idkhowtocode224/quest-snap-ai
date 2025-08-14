import { useState } from "react";
import { SearchResult } from "@/components/SearchResults";

interface SearchResponse {
  results: SearchResult[];
  answer?: string;
}

// AI Response Generator - simulates intelligent responses
const generateAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Math questions
  if (lowerQuery.includes('what is') && (lowerQuery.includes('+') || lowerQuery.includes('-') || lowerQuery.includes('*') || lowerQuery.includes('/'))) {
    try {
      const expression = query.replace(/what is/i, '').trim();
      const result = eval(expression.replace('x', '*'));
      return `The answer is ${result}.`;
    } catch {
      return "I can help with basic math calculations. Please provide a clear mathematical expression.";
    }
  }
  
  // Weather questions
  if (lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
    return "I don't have access to real-time weather data in this demo. For current weather information, I'd recommend checking a weather service like Weather.com or your local weather app.";
  }
  
  // Time questions
  if (lowerQuery.includes('time') || lowerQuery.includes('date')) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()} and today's date is ${now.toLocaleDateString()}.`;
  }
  
  // Programming questions
  if (lowerQuery.includes('javascript') || lowerQuery.includes('react') || lowerQuery.includes('programming')) {
    return "JavaScript and React are powerful tools for web development. JavaScript is a versatile programming language that runs in browsers and on servers, while React is a popular library for building user interfaces. They work together to create dynamic, interactive web applications.";
  }
  
  // Science questions
  if (lowerQuery.includes('science') || lowerQuery.includes('physics') || lowerQuery.includes('chemistry')) {
    return "Science encompasses the systematic study of the natural world through observation and experimentation. It includes fields like physics (the study of matter and energy), chemistry (the study of atoms and molecules), and biology (the study of living organisms).";
  }
  
  // Health questions
  if (lowerQuery.includes('health') || lowerQuery.includes('exercise') || lowerQuery.includes('nutrition')) {
    return "Maintaining good health involves a balanced approach including regular exercise, proper nutrition, adequate sleep, and stress management. For specific medical advice, always consult with healthcare professionals.";
  }
  
  // History questions
  if (lowerQuery.includes('history') || lowerQuery.includes('war') || lowerQuery.includes('ancient')) {
    return "History helps us understand how past events have shaped our present world. Studying historical patterns, conflicts, and civilizations provides valuable insights into human behavior and societal development.";
  }
  
  // Technology questions
  if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence') || lowerQuery.includes('machine learning')) {
    return "Artificial Intelligence (AI) is a field of computer science focused on creating systems that can perform tasks that typically require human intelligence. This includes machine learning, natural language processing, and computer vision. AI is increasingly integrated into everyday applications.";
  }
  
  // General questions
  if (lowerQuery.startsWith('what is') || lowerQuery.startsWith('what are')) {
    const topic = query.replace(/what (is|are)/i, '').trim();
    return `${topic} is a topic that encompasses various aspects and considerations. While I can provide general information, the specific details would depend on the context you're interested in. For more comprehensive information, you might want to explore academic sources or specialized resources.`;
  }
  
  if (lowerQuery.startsWith('how to') || lowerQuery.startsWith('how do')) {
    const task = query.replace(/how (to|do)/i, '').trim();
    return `To ${task}, you'll typically need to break it down into manageable steps. The specific approach depends on your current situation and goals. I'd recommend starting with research, planning your approach, and taking it one step at a time.`;
  }
  
  if (lowerQuery.startsWith('why')) {
    const topic = query.replace(/why/i, '').trim();
    return `The reasons for ${topic} can be complex and multifaceted. Various factors including historical context, scientific principles, and human behavior often contribute to such phenomena. Understanding these underlying causes requires examining multiple perspectives.`;
  }
  
  // Default response
  return `Based on your question about "${query}", this is a topic that involves several important considerations. While I can provide general insights, the specific details would depend on various factors and context. For the most accurate and up-to-date information, I'd recommend consulting authoritative sources in the relevant field.`;
};

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
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a contextual answer based on the query
      const answer = generateAIResponse(query);
      
      // Optional: Show fewer source results since answer is the main focus
      const mockResults: SearchResult[] = [
        {
          title: `Learn more about: ${query}`,
          snippet: `Explore additional resources and detailed information about ${query} from trusted sources.`,
          url: "https://example.com/source1",
          source: "example.com"
        }
      ];

      setAnswer(answer);
      setResults(mockResults);
    } catch (err) {
      setError("Failed to generate response. Please try again.");
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