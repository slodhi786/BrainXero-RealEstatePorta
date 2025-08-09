import { useState } from "react";
import { Heart } from "lucide-react";
import { useUserStore } from "@/store/user/use-user-store";
import { useServices } from "@/di/use-services";
import type { PropertyDto } from "@/types/property";

interface Props {
  property: PropertyDto;
}

export default function FavoriteButton({ property }: Props) {
  const user = useUserStore((s) => s.user);
  const { propertyService } = useServices();
  const [isFav, setIsFav] = useState(
    Boolean(property.isFavorite)
  );
  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    if (!user) {
      alert("Please sign in to add favorites.");
      return;
    }

    const newState = !isFav;
    setIsFav(newState);
    setLoading(true);

    try {
      if (newState) {
        await propertyService.addFavorite(property.id);
      } else {
        await propertyService.removeFavorite(property.id);
      }
    } catch (err) {
      console.error(err);
      // revert if API fails
      setIsFav(!newState);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-1 px-2 py-1 rounded ${
        isFav ? "text-red-500" : "text-gray-500"
      }`}
    >
      <Heart className={isFav ? "fill-current" : ""} size={18} />
      <span>{isFav ? "Unfavorite" : "Favorite"}</span>
    </button>
  );
}
