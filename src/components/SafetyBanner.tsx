import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const SafetyBanner = () => {
  return (
    <div className="bg-[#005BBB] text-white py-2">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm">
        <Shield className="h-4 w-4" />
        <span>Shop safely with PushNshop</span>
        <Link to="/safety-tips" className="underline">
          Learn More
        </Link>
      </div>
    </div>
  );
};