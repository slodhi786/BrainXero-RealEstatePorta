import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePropertyStore } from "@/store/property/use-property-store";

const FALLBACK_IMG = "src/assets/images/fallback-property.png";

export default function MyFavoritesPage() {
  const { properties, loading, error, getFavorites } = usePropertyStore(
    (s) => s
  );
  const navigate = useNavigate();

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          My Favorites
        </h1>
        {!!properties.length && (
          <div className="text-sm text-slate-500">
            {properties.length} saved
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border shadow-sm overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-5 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && !!error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          <div className="font-semibold">Couldn’t load favorites</div>
          <div className="text-sm mt-1">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && properties.length === 0 && (
        <div className="rounded-2xl border bg-white p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
            <span className="text-2xl">💜</span>
          </div>
          <h2 className="mt-4 text-xl md:text-2xl font-semibold text-slate-800">
            No favorites yet
          </h2>
          <p className="mt-2 text-slate-600 max-w-md mx-auto">
            Tap the heart on any listing to save it here. You can compare later
            and pick the perfect place.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Explore listings
            </button>
            <Link
              to="/favorites"
              className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50"
            >
              Refresh
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {properties.map((p) => {
            const img = p.thumbnailUrl || p.imageUrls?.[0] || FALLBACK_IMG;
            return (
              <Link
                to={`/property/${p.id}`}
                key={p.id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={img}
                    alt={p.title}
                    className="w-full aspect-[4/3] object-cover bg-slate-100"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                  {p.status && (
                    <span className="absolute top-3 left-3 text-xs font-medium bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border">
                      {p.status}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-semibold line-clamp-1 text-slate-800 group-hover:text-indigo-700">
                    {p.title}
                  </div>
                  <div className="text-sm text-slate-600 line-clamp-1 mt-1">
                    {p.location || p.address}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg font-bold text-slate-900">
                      PKR {Number(p.price).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500">
                      {p.sizeLabel || p.areaLabel || "—"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
