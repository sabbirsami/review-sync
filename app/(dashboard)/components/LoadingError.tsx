import { AlertCircle, BarChart3, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface LoadingErrorProps {
  error?: string;
}

export default function LoadingError({ error }: LoadingErrorProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4E9] flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border border-red-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B5551] mb-3">Connection Error</h2>
          <p className="text-[#1B5551]/70 mb-8 leading-relaxed">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#0B5C58] to-[#1B5551] text-white rounded-xl hover:from-[#1B5551] hover:to-[#0B5C58] transition-all duration-200 hover:shadow-xl font-medium"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4E9] flex items-center justify-center p-4">
      <div className="text-center bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full">
        <div className="w-16 h-16 bg-[#F0EDE0] rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-[#1B5551]/60" />
        </div>
        <h2 className="text-2xl font-bold text-[#1B5551] mb-3">No Data Available</h2>
        <p className="text-[#1B5551]/70 mb-8 leading-relaxed">
          Start collecting reviews to see your analytics dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#0B5C58] to-[#1B5551] text-white rounded-xl hover:from-[#1B5551] hover:to-[#0B5C58] transition-all duration-200 hover:shadow-xl font-medium"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </Link>
      </div>
    </div>
  );
}
