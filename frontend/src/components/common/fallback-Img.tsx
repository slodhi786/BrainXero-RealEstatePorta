import { useState } from "react";
import localFallback from "@/assets/images/fallback-property.png";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export default function FallbackImg({ fallback, onError, ...rest }: Props) {
  const [err, setErr] = useState(false);

  const fallbackSrc = fallback || localFallback;

  return (
    <img
      {...rest}
      src={err ? fallbackSrc : rest.src ?? ""}
      onError={(e) => {
        if (!err) {
          setErr(true);
        }
        onError?.(e as any);
      }}
    />
  );
}
