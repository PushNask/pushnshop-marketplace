import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}