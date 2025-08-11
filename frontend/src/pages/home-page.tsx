/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePropertyStore } from "@/store/property/use-property-store";
import FavoriteButton from "@/components/common/favorite-button";
import FallbackImg from "@/components/common/fallback-Img";
import { MapPin, SlidersHorizontal, Search } from "lucide-react";

function HomePageInner() {
  const {
    properties,
    totalCount,
    page,
    pageSize,
    sortBy,
    sortOrder,
    loading,
    traceId,
    error,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    fetchList,
    q,
    city,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
  } = usePropertyStore((s) => s);

  const [qInput, setQInput] = useState(q || "");
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    fetchList();
  }, [
    page,
    pageSize,
    sortBy,
    sortOrder,
    type,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    q,
    fetchList,
  ]);

  const applySearch = () => setFilter({ q: qInput });
  const toggleType = (t: "" | "House" | "Apartment" | "Plot") =>
    setFilter({ type: type === t ? "" : t });

  return (
    <>
      {/* HERO – background lives here, not on the page root */}
      <section className="relative">
        {/* BG image layer (full-bleed) */}
        <div className="absolute inset-0 -z-10 bg-[url('https://zealous-bush-09a3b4d1e.1.azurestaticapps.net/bg1.webp')] bg-cover bg-center" />
        {/* Contrast overlay */}
        <div className="absolute inset-0 -z-10 bg-white/60" />

        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <span className="inline-flex items-center gap-2 text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100 px-3 py-1 rounded-full text-sm font-medium">
                <span className="size-2 rounded-full bg-emerald-500" />
                Fresh listings • Updated daily
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 mt-4">
                Find your perfect home
              </h1>
              <p className="text-slate-600 mt-4 max-w-xl">
                Powerful filters, instant favorites, and clean details—built for
                speed.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip
                  active={type === ""}
                  onClick={() => toggleType("")}
                  label="All"
                />
                <Chip
                  active={type === "House"}
                  onClick={() => toggleType("House")}
                  label="Houses"
                />
                <Chip
                  active={type === "Apartment"}
                  onClick={() => toggleType("Apartment")}
                  label="Apartments"
                />
                <Chip
                  active={type === "Plot"}
                  onClick={() => toggleType("Plot")}
                  label="Plots"
                />
                <Chip icon={<MapPin size={16} />} label="Near me" />
                <Chip icon={<SlidersHorizontal size={16} />} label="Filters" />
              </div>
            </div>

            {/* search panel */}
            <div className="p-4 md:p-6 bg-white rounded-2xl shadow text-slate-800">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Search
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="City, area, or keywords"
                      value={qInput}
                      onChange={(e) => setQInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applySearch()}
                    />
                    <button
                      onClick={applySearch}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <Search size={16} /> Search
                    </button>
                  </div>
                </div>

                <Field label="City">
                  <input
                    className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Karachi"
                    value={city || ""}
                    onChange={(e) => setFilter({ city: e.target.value })}
                  />
                </Field>
                <Field label="Min Price">
                  <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                    placeholder="10000000"
                    value={minPrice ?? ""}
                    onChange={(e) =>
                      setFilter({
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </Field>
                <Field label="Max Price">
                  <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                    placeholder="50000000"
                    value={maxPrice ?? ""}
                    onChange={(e) =>
                      setFilter({
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </Field>

                <Field label="Bedrooms">
                  <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                    placeholder="3"
                    value={bedrooms ?? ""}
                    onChange={(e) =>
                      setFilter({
                        bedrooms: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </Field>
                <Field label="Bathrooms">
                  <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                    placeholder="2"
                    value={bathrooms ?? ""}
                    onChange={(e) =>
                      setFilter({
                        bathrooms: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* header controls */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-800">
              Featured Listings
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split(":");
                  setSort(by, order as "asc" | "desc");
                }}
                className="border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              >
                <option value="price:desc">Price (High→Low)</option>
                <option value="price:asc">Price (Low→High)</option>
                <option value="bedrooms:desc">Bedrooms (High→Low)</option>
                <option value="bedrooms:asc">Bedrooms (Low→High)</option>
                <option value="title:asc">Title (A→Z)</option>
              </select>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm bg-white text-slate-900"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* LISTINGS GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {loading && (
          <div className="rounded-xl border p-4 animate-pulse bg-white text-slate-800">
            Loading properties…
          </div>
        )}

        {!!error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-4">
            <div className="font-medium">Error</div>
            <div>{error}</div>
            {traceId && (
              <div className="mt-1 text-xs opacity-75">Trace ID: {traceId}</div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.isArray(properties) &&
            properties.map((p) => {
              const primary =
                p.thumbnailUrl ||
                p.imageUrls?.[0] ||
                `https://picsum.photos/seed/${p.id}/800/600`;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                >
                  <Link to={`/property/${p.id}`} className="block">
                    <div className="relative">
                      <FallbackImg
                        src={primary}
                        alt={p.title}
                        className="w-full aspect-[4/3] object-cover bg-slate-100"
                      />
                      {p.status && (
                        <span className="absolute top-3 left-3 text-xs font-medium bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border">
                          {p.status}
                        </span>
                      )}
                    </div>

                    <div className="p-4 text-slate-800">
                      <h3 className="font-semibold line-clamp-1">{p.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-1 mt-1">
                        <MapPin className="inline mr-1 size-4" />
                        {p.location || p.address}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-lg font-bold">
                          PKR {Number(p.price).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">
                          {p.sizeLabel || (p as any).areaLabel || "—"}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-4 pb-4 text-sm text-slate-600 flex items-center gap-4">
                    <span>🛏 {p.bedrooms ?? "—"} Bed</span>
                    <span>🛁 {p.bathrooms ?? "—"} Bath</span>
                    <span>🚗 {p.carSpots ?? "—"}</span>
                    <span className="ml-auto">
                      <FavoriteButton property={p as any} />
                    </span>
                  </div>
                </div>
              );
            })}

          {!loading && !error && properties.length === 0 && (
            <div className="opacity-70">No properties found.</div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1 || loading}
            className="px-3 py-2 border rounded-lg bg-white disabled:opacity-50 text-slate-800"
          >
            Prev
          </button>
          <span className="self-center text-sm text-slate-700">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={loading || page >= totalPages}
            className="px-3 py-2 border rounded-lg bg-white disabled:opacity-50 text-slate-800"
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-700",
      ].join(" ")}
    >
      {icon} {label}
    </button>
  );
}

export default function HomePage() {
  return <HomePageInner />;
}
