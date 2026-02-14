import { CheckCircle } from 'lucide-react';

export function VerifiedBadge() {
  return (
    <div
      className="flex items-center gap-1 text-xs font-bold text-accent"
      title="Verified Mentor"
    >
      <div className="relative">
        <CheckCircle className="w-5 h-5" />
        <div className="absolute inset-0 -z-10 animate-pulse bg-accent/50 blur-md rounded-full"></div>
      </div>
      <span className="hidden sm:inline">Verified</span>
    </div>
  );
}
