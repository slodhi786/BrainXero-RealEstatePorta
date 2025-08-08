import { useEffect } from "react";
import { usePropertyStore } from "@/store/property.store";

const HomePage = () => {
  const {
    properties,
    totalCount,
    page,
    pageSize,
    loading,
    error,
    traceId,
    sortBy,
    sortOrder,
    setPage,
    setSort,
    fetchList,
  } = usePropertyStore();

  useEffect(() => {
    fetchList();
  }, [page, pageSize, sortBy, sortOrder, fetchList]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Featured Properties</h1>

      {/* Sort Controls */}
      <div className="mb-4 flex gap-2">
        <label className="self-center text-sm font-medium">Sort by:</label>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split(":");
            setSort(by, order as "asc" | "desc");
          }}
          className="border rounded px-2 py-1"
        >
          <option value="bedrooms:desc">Bedrooms (High → Low)</option>
          <option value="bedrooms:asc">Bedrooms (Low → High)</option>
          <option value="price:desc">Price (High → Low)</option>
          <option value="price:asc">Price (Low → High)</option>
        </select>
      </div>

      {loading && <p>Loading properties...</p>}

      {!!error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-3">
          <div className="font-medium">Error</div>
          <div>{error}</div>
          {traceId && (
            <div className="mt-1 text-xs opacity-75">Trace ID: {traceId}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.isArray(properties) && properties.map((p) => (
          <div key={p.id} className="border p-4 shadow rounded">
            <img
              src={p.imageUrls?.[0]}
              alt={p.title}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p>{p.address}</p>
            <p className="font-medium text-green-700">
              PKR {p.price.toLocaleString()}
            </p>
          </div>
        ))}
        {!loading && !error && properties.length === 0 && (
          <div className="opacity-70">No properties found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * pageSize >= totalCount}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
