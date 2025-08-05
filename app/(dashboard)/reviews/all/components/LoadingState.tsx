import { RefreshCw } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-[#F7F4E9] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
          <RefreshCw className="w-10 h-10 animate-spin absolute top-4 left-4 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading Reviews</h2>
        <p className="text-foreground/70">Gathering your customer feedback...</p>
      </div>
    </div>
  );
}
