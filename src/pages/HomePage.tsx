import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PropertyStoreProvider } from "@/store/property/property-store.provider";
import { usePropertyStore } from "@/store/property/use-property-store";

function HomePageInner() {
  const {
    properties,
    totalCount,
    page,
    pageSize,
    sortBy,
    sortOrder,
    loading,
    error,
    traceId,
    setPage,
    setPageSize,
    setSort,
    fetchList,
  } = usePropertyStore((s) => s);

  useEffect(() => {
    fetchList();
  }, [page, pageSize, sortBy, sortOrder, fetchList]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Featured Properties</h1>

        {/* Sort + PageSize controls */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Sort:</label>
          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split(":");
              setSort(by, order as "asc" | "desc");
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="bedrooms:desc">Bedrooms (High → Low)</option>
            <option value="bedrooms:asc">Bedrooms (Low → High)</option>
            <option value="price:desc">Price (High → Low)</option>
            <option value="price:asc">Price (Low → High)</option>
          </select>

          <label className="text-sm ml-3">Page size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border p-4 animate-pulse">
          Loading properties…
        </div>
      )}

      {!!error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <div className="font-medium">Error</div>
          <div>{error}</div>
          {traceId && (
            <div className="mt-1 text-xs opacity-75">Trace ID: {traceId}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.isArray(properties) &&
          properties.map((p) => (
            <div key={p.id} className="border p-4 shadow rounded">
              <Link to={`/properties/${p.id}`} className="block">
                <img
                  src={p.imageUrls?.[0]}
                  alt={p.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm opacity-80">{p.address}</p>
                <p className="mt-1 font-medium text-green-700">
                  PKR {p.price.toLocaleString()}
                </p>
                <div className="mt-2 text-xs opacity-80">
                  <span className="mr-3">🛏 {p.bedrooms}</span>
                  <span className="mr-3">🛁 {p.bathrooms}</span>
                  <span>🚗 {p.carSpots}</span>
                </div>
              </Link>
            </div>
          ))}

        {!loading && !error && properties.length === 0 && (
          <div className="opacity-70">No properties found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1 || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center text-sm">
          Page <b>{page}</b> of{" "}
          <b>{Math.max(1, Math.ceil(totalCount / pageSize))}</b>
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={loading || page * pageSize >= totalCount}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <PropertyStoreProvider>
      <HomePageInner />
    </PropertyStoreProvider>
  );
}
