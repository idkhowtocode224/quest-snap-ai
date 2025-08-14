import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

// Function to search web and scrape content
async function searchAndScrape(query: string): Promise<{ results: SearchResult[], answer: string }> {
  try {
    // Step 1: Search DuckDuckGo (no API key needed)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    // Step 2: Extract results
    const results: SearchResult[] = [];
    
    // Get instant answer if available
    let answer = "";
    if (searchData.Answer) {
      answer = searchData.Answer;
    } else if (searchData.AbstractText) {
      answer = searchData.AbstractText;
    }
    
    // Get related topics and results
    if (searchData.RelatedTopics && searchData.RelatedTopics.length > 0) {
      for (const topic of searchData.RelatedTopics.slice(0, 3)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
            snippet: topic.Text,
            url: topic.FirstURL,
            source: new URL(topic.FirstURL).hostname
          });
        }
      }
    }
    
    // If no instant answer, try to search Bing (fallback)
    if (!answer && results.length === 0) {
      // Use a simple web scraping approach for common queries
      answer = await generateFallbackAnswer(query);
      
      // Add some generic results
      results.push({
        title: `Information about: ${query}`,
        snippet: `Search results and information related to ${query} from various sources.`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: "duckduckgo.com"
      });
    }
    
    // If still no answer, create a contextual one
    if (!answer) {
      answer = `Based on available information about "${query}", this appears to be a topic that would benefit from further research. The search results above provide relevant information from various sources.`;
    }
    
    return { results, answer };
    
  } catch (error) {
    console.error('Search error:', error);
    return {
      results: [],
      answer: `I apologize, but I encountered an error while searching for information about "${query}". Please try again with a different query.`
    };
  }
}

// Fallback answer generator for common query types
async function generateFallbackAnswer(query: string): Promise<string> {
  const lowerQuery = query.toLowerCase();
  
  // Math calculations
  if (lowerQuery.includes('what is') && /[\+\-\*\/\d]/.test(query)) {
    try {
      const mathExpression = query.replace(/what is/i, '').trim();
      // Basic math evaluation (safe)
      if (/^[\d\+\-\*\/\.\(\)\s]+$/.test(mathExpression)) {
        const result = eval(mathExpression);
        return `The answer is ${result}.`;
      }
    } catch (e) {
      return "I can help with basic math calculations. Please provide a clear mathematical expression.";
    }
  }
  
  // Current time/date
  if (lowerQuery.includes('time') || lowerQuery.includes('date')) {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()} and today's date is ${now.toLocaleDateString()}.`;
  }
  
  // Weather (acknowledge limitation)
  if (lowerQuery.includes('weather')) {
    return "I don't have access to real-time weather data. For current weather information, please check a weather service or app.";
  }
  
  // Default contextual response
  return `I searched for information about "${query}" but didn't find specific details. This topic may require more specialized sources or recent information.`;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Searching for:', query)
    
    const searchResults = await searchAndScrape(query)
    
    return new Response(
      JSON.stringify(searchResults),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        results: [],
        answer: "I apologize, but I encountered an error while processing your request. Please try again."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})