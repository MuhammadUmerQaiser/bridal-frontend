import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { isImageCached, markImageCached } from "../utils/imageCache";
import { optimizeImageUrl } from "../utils/optimizeImage";

const LazyImage = memo(({
  src,
  alt = "",
  className = "",
  style,
  size = "card",
  eager = false,
  fetchPriority,
  rootMargin = "400px",
  ...props
}) => {
  const displaySrc = useMemo(
    () => (src ? optimizeImageUrl(src, size) : src),
    [src, size]
  );
  const hostRef = useRef(null);
  const committedRef = useRef(
    Boolean(displaySrc && (eager || isImageCached(src) || isImageCached(displaySrc)))
  );
  const [activeSrc, setActiveSrc] = useState(() =>
    committedRef.current ? displaySrc : null
  );
  const [loaded, setLoaded] = useState(
    () => isImageCached(src) || isImageCached(displaySrc)
  );

  useEffect(() => {
    if (!displaySrc) {
      return;
    }

    if (isImageCached(src) || isImageCached(displaySrc)) {
      committedRef.current = true;
      setActiveSrc(displaySrc);
      setLoaded(true);
      return;
    }

    if (eager || committedRef.current) {
      committedRef.current = true;
      setActiveSrc(displaySrc);
      return;
    }

    const node = hostRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      committedRef.current = true;
      setActiveSrc(displaySrc);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          committedRef.current = true;
          setActiveSrc(displaySrc);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, displaySrc, eager, rootMargin]);

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
            markImageCached(displaySrc);
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
