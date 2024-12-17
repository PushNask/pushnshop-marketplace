import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm
        transition-colors duration-200
        ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}