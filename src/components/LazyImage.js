import React, { memo, useEffect, useRef, useState } from "react";
import { isImageCached, markImageCached } from "../utils/imageCache";

const LazyImage = memo(({
  src,
  alt = "",
  className = "",
  style,
  eager = false,
  fetchPriority,
  rootMargin = "400px",
  ...props
}) => {
  const hostRef = useRef(null);
  const committedRef = useRef(Boolean(src && (eager || isImageCached(src))));
  const [activeSrc, setActiveSrc] = useState(() =>
    committedRef.current ? src : null
  );
  const [loaded, setLoaded] = useState(() => isImageCached(src));

  useEffect(() => {
    if (!src) {
      return;
    }

    if (isImageCached(src)) {
      committedRef.current = true;
      setActiveSrc(src);
      setLoaded(true);
      return;
    }

    if (eager || committedRef.current) {
      committedRef.current = true;
      setActiveSrc(src);
      return;
    }

    const node = hostRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      committedRef.current = true;
      setActiveSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          committedRef.current = true;
          setActiveSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, eager, rootMargin]);

  if (!src) return null;

  const isReady = loaded || isImageCached(src);

  return (
    <span ref={hostRef} className="lazy-image-host">
      {activeSrc && (
        <img
          src={activeSrc}
          alt={alt}
          className={`lazy-image ${isReady ? "is-loaded" : ""} ${className}`.trim()}
          style={style}
          loading={eager || committedRef.current ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={fetchPriority || (eager ? "high" : "auto")}
          onLoad={() => {
            markImageCached(src);
            setLoaded(true);
          }}
          {...props}
        />
      )}
    </span>
  );
});

LazyImage.displayName = "LazyImage";

export default LazyImage;
