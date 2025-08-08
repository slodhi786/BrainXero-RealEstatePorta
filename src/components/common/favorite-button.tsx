import { usePropertyStore } from "@/store/property/use-property-store";
//import { useUserStore } from "@/store/user.store";

export function FavoriteButton({
  propertyId,
  compact = false,
}: {
  propertyId: string;
  compact?: boolean;
}) {
  const toggleFavorite = usePropertyStore((s) => s.toggleFavorite);
  const property = usePropertyStore(
    (s) => s.properties.find((p) => p.id === propertyId) || s.selected
  );
  const userId = "B23399DC-5E9D-4F89-9CF7-08DDD60B90C8"; //useUserStore((s) => s.id);

  if (!property) return null;

  const isFavorited = !!property.favoritedBy?.some(
    (f: { userId: string }) => f.userId === userId
  );
  const count = property.favoritedBy?.length ?? 0;

  const onClick = () => {
    if (!userId) {
      alert("Please sign in to favorite.");
      return;
    }
    void toggleFavorite(propertyId, userId);
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 text-sm ${
          isFavorited ? "text-red-600" : "text-gray-600"
        }`}
        aria-pressed={isFavorited}
        title={isFavorited ? "Unfavorite" : "Favorite"}
      >
        <span>{isFavorited ? "♥" : "♡"}</span>
        <span>{count}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-1 ${
        isFavorited ? "border-red-300 bg-red-50 text-red-700" : ""
      }`}
      aria-pressed={isFavorited}
    >
      {isFavorited ? "♥ Favorited" : "♡ Favorite"} {count ? `(${count})` : ""}
    </button>
  );
}
