interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'available';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    active: "bg-blue-100 text-blue-800",
    available: "bg-gray-100 text-gray-800"
  };

  const labels = {
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    active: "Active",
    available: "Available"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}>
      {labels[status]}
    </span>
  );
}