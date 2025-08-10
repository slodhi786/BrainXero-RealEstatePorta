/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { PropertyDto } from "@/types/property";
import FavoriteButton from "@/components/common/favorite-button";
import { MapPin } from "lucide-react";
import FallbackImg from "@/components/common/fallback-Img";
import { usePropertyStore } from "@/store/property/use-property-store";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const getPropertyById = usePropertyStore((s) => s.getPropertyById);
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) {
        setError("Invalid property id");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        if (mounted) setProperty(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, getPropertyById]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!property) return <div className="p-6">Not found</div>;

  const imgs = property.imageUrls?.length
    ? property.imageUrls
    : ([property.thumbnailUrl].filter(Boolean) as string[]);

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
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <p className="text-slate-600 mt-1">
                <MapPin className="inline mr-1 size-4" />
                {property.location || property.address}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-slate-700">
                <Badge>
                  Price: PKR {Number(property.price).toLocaleString()}
                </Badge>
                <Badge>🛏 {property.bedrooms ?? "—"} Bed</Badge>
                <Badge>🛁 {property.bathrooms ?? "—"} Bath</Badge>
                <Badge>🚗 {property.carSpots ?? "—"}</Badge>
                {property.sizeLabel && <Badge>{property.sizeLabel}</Badge>}
                {property.status && <Badge>{property.status}</Badge>}
                {property.propertyType && (
                  <Badge>{property.propertyType}</Badge>
                )}
              </div>

              <div className="mt-6 prose max-w-none">
                <h3>Description</h3>
                <p>
                  A thoughtfully designed property with modern finishes. Close
                  to schools, markets, and public transit.
                </p>
              </div>
            </div>

            {/* map */}
            <div className="mt-6 bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Location</h3>
                <a
                  className="text-sm text-indigo-700 cursor-pointer"
                  href={
                    property.lat && property.lng
                      ? `https://www.google.com/maps?q=${property.lat},${property.lng}`
                      : undefined
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>
              <div className="mt-3 h-64 w-full rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center">
                {property.lat && property.lng ? (
                  <span>
                    Map preview at ({property.lat}, {property.lng})
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
                    PKR {Number(property.price).toLocaleString()}
                  </div>
                  {property.status && (
                    <div className="text-slate-600">{property.status}</div>
                  )}
                </div>
                <FavoriteButton property={property} />
              </div>

              <div className="mt-4 text-sm text-slate-700">
                <div>Bedrooms: {property.bedrooms ?? "—"}</div>
                <div>Bathrooms: {property.bathrooms ?? "—"}</div>
                <div>Parking: {property.carSpots ?? "—"}</div>
                {property.sizeLabel && <div>Size: {property.sizeLabel}</div>}
                {property.propertyType && (
                  <div>Type: {property.propertyType}</div>
                )}
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
