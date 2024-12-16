import { Shield } from "lucide-react";

export const SafetyBanner = () => {
  return (
    <div className="safety-banner animate-fade-down w-full py-3">
      <div className="container flex items-center justify-center gap-2 text-sm font-medium">
        <Shield className="h-4 w-4" />
        <span>Secure, Verified Transactions with Local Payment Partners</span>
      </div>
    </div>
  );
};