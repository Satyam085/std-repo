import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { createDb, products } from "@repo/db";
import { env } from "cloudflare:workers";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
}

const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    name: "Minimal Mechanical Keyboard",
    slug: "minimal-mechanical-keyboard",
    description: "Hot-swappable switches, PBT keycaps, and custom aluminum case.",
    price: 149.99,
    stock: 24,
    category: "Electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod-2",
    name: "Ergonomic Desk Mat",
    slug: "ergonomic-desk-mat",
    description: "Micro-woven waterproof cloth surface with anti-slip rubber base.",
    price: 34.5,
    stock: 80,
    category: "Accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod-3",
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-headphones",
    description: "40-hour battery life, high-res audio codec support, ultra comfort.",
    price: 279.0,
    stock: 12,
    category: "Audio",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prod-4",
    name: "Titanium Thermal Bottle",
    slug: "titanium-thermal-bottle",
    description: "Double-walled vacuum insulation keeping beverages cold for 24h.",
    price: 48.0,
    stock: 45,
    category: "Lifestyle",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  },
];

export const fetchProductsServer = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const db = createDb(env.DB);
    const list = await db.select().from(products).limit(20);
    if (list.length > 0) {
      return list as ProductItem[];
    }
  } catch {
    // Return sample items if D1 tables are not yet seeded locally
  }
  return SAMPLE_PRODUCTS;
});

export const Route = createFileRoute("/products")({
  loader: async () => {
    return await fetchProductsServer();
  },
  component: ProductsPage,
});

function ProductsPage() {
  const initialData = Route.useLoaderData();

  const { data: productList } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProductsServer(),
    initialData,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Storefront Catalog
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
          Populated with SSR hydration and synced via <strong>TanStack Query</strong> from
          Cloudflare D1.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productList?.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
          >
            <div>
              {item.imageUrl && (
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100 dark:bg-gray-700 h-48">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {item.category}
                </span>
                <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60 mt-4">
              <span className="text-xl font-black text-gray-900 dark:text-white">
                ${item.price.toFixed(2)}
              </span>
              <button
                type="button"
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                onClick={() => alert(`Added ${item.name} to cart!`)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
