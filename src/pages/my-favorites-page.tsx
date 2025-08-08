/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useServices } from "@/di/use-services";
import type { PropertyDto } from "@/types/property";
import { Link } from "react-router-dom";

export default function MyFavoritesPage() {
  const { propertyService } = useServices();
  const [items, setItems] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setItems(await propertyService.getMyFavorites());
      } catch (e: any) {
        setError(e?.message ?? "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    })();
  }, [propertyService]);

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <Link
            to={`/properties/${p.id}`}
            key={p.id}
            className="border p-4 rounded shadow"
          >
            <img
              src={p.imageUrls?.[0]}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm opacity-80">{p.address}</div>
            <div className="font-medium text-green-700">
              PKR {p.price.toLocaleString()}
            </div>
          </Link>
        ))}
        {!items.length && <div className="opacity-70">No favorites yet.</div>}
      </div>
    </div>
  );
}
