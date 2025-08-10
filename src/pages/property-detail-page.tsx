/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "@/services/api.service";
import type { PropertyDto } from "@/types/property";
import FavoriteButton from "@/components/common/favorite-button";
import { MapPin } from "lucide-react";
import FallbackImg from "@/components/common/fallback-Img";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<PropertyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await http.get<PropertyDto>(`/property/${id}`);
        if (mounted) setData(res);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">Not found</div>;

  const imgs = data.imageUrls?.length
    ? data.imageUrls
    : ([data.thumbnailUrl].filter(Boolean) as string[]);

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="text-sm text-indigo-700">
          ← Back to listings
        </Link>

        <div className="mt-4 grid lg:grid-cols-3 gap-6">
          {/* gallery */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-2">
              {imgs.slice(0, 1).map((src) => (
                <FallbackImg
                  key={src}
                  src={src}
                  className="col-span-3 rounded-lg w-full aspect-[16/9] object-cover"
                />
              ))}
              {imgs.slice(1, 4).map((src) => (
                <FallbackImg
                  key={src}
                  src={src}
                  className="rounded-lg w-full aspect-[4/3] object-cover"
                />
              ))}
            </div>

            <div className="mt-6 bg-white rounded-xl shadow p-5">
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <p className="text-slate-600 mt-1">
                <MapPin className="inline mr-1 size-4" />
                {data.location || data.address}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-slate-700">
                <Badge>Price: PKR {Number(data.price).toLocaleString()}</Badge>
                <Badge>🛏 {data.bedrooms ?? "—"} Bed</Badge>
                <Badge>🛁 {data.bathrooms ?? "—"} Bath</Badge>
                <Badge>🚗 {data.carSpots ?? "—"}</Badge>
                {data.sizeLabel && <Badge>{data.sizeLabel}</Badge>}
                {data.status && <Badge>{data.status}</Badge>}
                {data.propertyType && <Badge>{data.propertyType}</Badge>}
              </div>

              <div className="mt-6 prose max-w-none">
                <h3>Description</h3>
                <p>
                  A thoughtfully designed property with modern finishes. Close
                  to schools, markets, and public transit.
                </p>
              </div>
            </div>

            {/* map placeholder */}
            <div className="mt-6 bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Location</h3>
                <a className="text-sm text-indigo-700 cursor-pointer">
                  Open in Google Maps
                </a>
              </div>
              <div className="mt-3 h-64 w-full rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center">
                {data.lat && data.lng ? (
                  <span>
                    Map preview at ({data.lat}, {data.lng})
                  </span>
                ) : (
                  <span>Map coming soon</span>
                )}
              </div>
            </div>
          </div>

          {/* sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    PKR {Number(data.price).toLocaleString()}
                  </div>
                  {data.status && (
                    <div className="text-slate-600">{data.status}</div>
                  )}
                </div>
                <FavoriteButton property={data} />
              </div>

              <div className="mt-4 text-sm text-slate-700">
                <div>Bedrooms: {data.bedrooms ?? "—"}</div>
                <div>Bathrooms: {data.bathrooms ?? "—"}</div>
                <div>Parking: {data.carSpots ?? "—"}</div>
                {data.sizeLabel && <div>Size: {data.sizeLabel}</div>}
                {data.propertyType && <div>Type: {data.propertyType}</div>}
              </div>

              <button className="mt-5 w-full rounded-lg bg-indigo-600 text-white py-2.5 hover:bg-indigo-700">
                Contact Agent
              </button>
            </div>

            {/* agent card (static for now) */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold">Listing Agent</h3>
              <div className="mt-3 flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={`https://i.pravatar.cc/120?img=5`}
                />
                <div>
                  <div className="font-medium">Ayesha Khan</div>
                  <div className="text-sm text-slate-600">
                    Senior Consultant
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full border rounded-lg py-2 hover:bg-slate-50">
                Send Message
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
      {children}
    </span>
  );
}
