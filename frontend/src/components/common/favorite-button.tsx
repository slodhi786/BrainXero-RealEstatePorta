import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useUserStore } from "@/store/user/use-user-store";
import { usePropertyStore } from "@/store/property/use-property-store";
import type { PropertyDto } from "@/types/property";

interface Props {
  property: PropertyDto;
}

export default function FavoriteButton({ property }: Props) {
  const user = useUserStore((s) => s.user);
  const toggleFavorite = usePropertyStore((s) => s.toggleFavorite);

  const [isFav, setIsFav] = useState(Boolean(property.isFavorite));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFav(Boolean(property.isFavorite));
  }, [property.isFavorite]);

  return (
    <button
      type="button"
      onClick={async () => {
        if (!user) {
          alert("Please sign in to add favorites.");
          return;
        }
        const current = isFav;
        const final = await toggleFavorite(property.id, current);
        setIsFav(final);
        setLoading(false);
      }}
      disabled={loading}
      className={`flex items-center gap-1 px-2 py-1 rounded ${
        isFav ? "text-red-500" : "text-gray-500"
      }`}
      aria-pressed={isFav}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={isFav ? "fill-current" : ""} size={18} />
      <span>{isFav ? "Unfavorite" : "Favorite"}</span>
    </button>
  );
}
