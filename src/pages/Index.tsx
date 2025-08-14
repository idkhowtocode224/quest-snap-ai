import { SearchInput } from "@/components/SearchInput";
import { SearchResults } from "@/components/SearchResults";
import { useSearch } from "@/hooks/useSearch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const { search, isLoading, results, answer, error } = useSearch();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              SearchGPT
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Ask anything,{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                get answers
              </span>
            </h2>
            <p className="text-xl text-search-text-secondary max-w-2xl mx-auto">
              Your AI-powered search companion. Get concise, accurate answers from the web's best sources.
            </p>
          </div>

          {/* Search Input */}
          <div className="flex justify-center">
            <SearchInput onSearch={search} isLoading={isLoading} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Search Results */}
          <SearchResults results={results} answer={answer} />

          {/* Empty State */}
          {!isLoading && results.length === 0 && !error && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground">Ready to search</h3>
              <p className="text-search-text-secondary max-w-md mx-auto">
                Type your question above to get started. I'll search the web and provide you with accurate, summarized answers.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-search-text-secondary">
            <p>Powered by intelligent search • Built for accuracy and speed</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
