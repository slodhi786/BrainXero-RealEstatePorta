import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { usePropertyStore } from "@/store/property/use-property-store";

function PropertyDetailInner() {
  const { id } = useParams<{ id: string }>();

  // Select fields individually (stable refs)
  const selected = usePropertyStore((s) => s.selected);
  const loading = usePropertyStore((s) => s.loading);
  const error = usePropertyStore((s) => s.error);
  const traceId = usePropertyStore((s) => s.traceId);
  const fetchById = usePropertyStore((s) => s.fetchById);
  const clearSelected = usePropertyStore((s) => s.clearSelected);

  useEffect(() => {
    if (id) fetchById(id);
    return () => clearSelected();
    // deliberately depend only on `id` to avoid action identity churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-4">Loading property…</div>;

  if (error) {
    return (
      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <div className="font-medium">Error</div>
          <div>{error}</div>
          {traceId && (
            <div className="mt-1 text-xs opacity-75">Trace ID: {traceId}</div>
          )}
        </div>
        <Link to="/" className="underline">
          ← Back
        </Link>
      </div>
    );
  }

  if (!selected) return <div className="p-4">Not found.</div>;

  const hero = selected.imageUrls?.[0];
  const thumbs = selected.imageUrls?.slice(1, 9) ?? [];

  return (
    <div className="p-4 space-y-4">
      <Link to="/" className="underline">
        ← Back
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-xl border bg-gray-100">
            {hero ? (
              <img
                src={hero}
                alt={selected.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm opacity-60">
                No image
              </div>
            )}
          </div>
          {thumbs.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {Array.isArray(thumbs) &&
                thumbs.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    className="h-20 w-full rounded object-cover border"
                  />
                ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{selected.title}</h1>
          <div className="opacity-80">{selected.address}</div>
          <div className="text-xl font-semibold">
            PKR {selected.price.toLocaleString()}
          </div>
          <div className="mt-2 text-sm">
            <span className="mr-4">🛏 {selected.bedrooms} Bedrooms</span>
            <span className="mr-4">🛁 {selected.bathrooms} Bathrooms</span>
            <span>🚗 {selected.carSpots} Car Spots</span>
          </div>
          <div className="mt-4 whitespace-pre-line">{selected.description}</div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  return <PropertyDetailInner />;
}
