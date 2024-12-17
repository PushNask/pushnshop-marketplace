import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  name_fr?: string;
}

interface CategoriesProps {
  categories?: Category[];
  language: string;
  isLoading: boolean;
}

export function Categories({ categories, language, isLoading }: CategoriesProps) {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#002C5F] mb-6">
          {language === "en" ? "Browse Categories" : "Parcourir les catégories"}
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-500">
            {language === "en"
              ? "Loading categories..."
              : "Chargement des catégories..."}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="p-4 text-center border border-gray-200 rounded-lg hover:border-[#005BBB] hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 mx-auto mb-2 opacity-70 group-hover:opacity-100">
                  <img src="/placeholder.svg" alt="" className="w-full h-full" />
                </div>
                <span className="text-[#002C5F]">
                  {language === "fr" ? category.name_fr : category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}