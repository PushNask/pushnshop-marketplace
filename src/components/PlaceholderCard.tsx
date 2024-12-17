interface PlaceholderCardProps {
  language: string;
}

export function PlaceholderCard({ language }: PlaceholderCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
      <div className="aspect-square bg-gray-100 mb-2" />
      <p className="text-sm font-medium">
        {language === "en"
          ? "New Deal's Coming Here"
          : "De nouvelles offres arrivent ici"}
      </p>
    </div>
  );
}