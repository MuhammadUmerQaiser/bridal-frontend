const PRESETS = {
  thumb: { width: 400, quality: 80 },
  card: { width: 600, quality: 80 },
  medium: { width: 900, quality: 85 },
  large: { width: 1200, quality: 85 },
  hero: { width: 1600, quality: 85 },
  detailThumb: { width: 150, quality: 75 },
};

function getOptions(preset) {
  if (typeof preset === "object" && preset !== null) {
    return preset;
  }
  return PRESETS[preset] || PRESETS.card;
}

function isOptimizableUrl(src) {
  return (
    typeof src === "string" &&
    (src.startsWith("http://") || src.startsWith("https://"))
  );
}

function optimizeImageKitUrl(src, { width, quality }) {
  if (src.includes("tr=") || src.includes("/tr:")) {
    return src;
  }

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-${quality},f-webp`;
}

function optimizeCloudinaryUrl(src, { width, quality }) {
  const uploadMarker = "/image/upload/";
  const markerIndex = src.indexOf(uploadMarker);
  if (markerIndex === -1) {
    return src;
  }

  const afterUpload = src.slice(markerIndex + uploadMarker.length);
  if (/^(w_|c_|q_|f_|g_)/.test(afterUpload)) {
    return src;
  }

  const transform = `w_${width},q_${quality},f_auto`;
  return src.replace(uploadMarker, `${uploadMarker}${transform}/`);
}

function isProxyOptimizedUrl(src) {
  return src.includes("wsrv.nl") || src.includes("images.weserv.nl");
}

function isNaqshzariBackendImage(src) {
  return /naqshzari\.com\/backend\/public\/images\//i.test(src);
}

function optimizeViaImageProxy(src, { width, quality }) {
  if (isProxyOptimizedUrl(src)) {
    return src;
  }

  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
    output: "webp",
    n: "-1",
  });

  return `https://wsrv.nl/?${params.toString()}`;
}

export function optimizeImageUrl(src, preset = "card") {
  if (!isOptimizableUrl(src)) {
    return src;
  }

  const options = getOptions(preset);
  const { width, quality = 80 } = options;

  if (src.includes("ik.imagekit.io")) {
    return optimizeImageKitUrl(src, { width, quality });
  }

  if (src.includes("res.cloudinary.com")) {
    return optimizeCloudinaryUrl(src, { width, quality });
  }

  if (isNaqshzariBackendImage(src)) {
    return optimizeViaImageProxy(src, { width, quality });
  }

  return src;
}

export { PRESETS as IMAGE_PRESETS };
