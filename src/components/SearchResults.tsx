import { ExternalLink, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  answer?: string;
}

export const SearchResults = ({ results, answer }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {answer && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <div className="space-y-2">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <Globe className="h-4 w-4" />
              AI Summary
            </h3>
            <p className="text-foreground leading-relaxed">{answer}</p>
          </div>
        </Card>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Search Results</h3>
        {results.map((result, index) => (
          <Card 
            key={index} 
            className="p-4 hover:bg-search-card-hover transition-all duration-200 hover:shadow-[var(--shadow-card)] group cursor-pointer"
            onClick={() => window.open(result.url, '_blank')}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-medium text-foreground group-hover:text-search-highlight transition-colors line-clamp-2">
                  {result.title}
                </h4>
                <ExternalLink className="h-4 w-4 text-search-text-secondary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-search-text-secondary text-sm leading-relaxed line-clamp-3">
                {result.snippet}
              </p>
              <div className="flex items-center gap-2 text-xs text-search-text-secondary">
                <Globe className="h-3 w-3" />
                <span className="truncate">{result.source}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};