import { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

export default function FallbackImg({ fallback = "/fallback-property.png", src, onError, ...rest }: Props) {
  const [broken, setBroken] = useState(false);
  const realSrc = broken ? fallback : (src ?? fallback);

  return (
    <img
      {...rest}
      src={realSrc}
      onError={(e) => {
        if (!broken) setBroken(true);   // avoid loops if fallback also fails
        onError?.(e as any);
      }}
    />
  );
}
