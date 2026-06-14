export async function compressImageFile(
  file,
  { maxWidth = 2000, maxHeight = 2000, quality = 0.85, maxSizeBytes = 1024 * 1024 } = {}
) {
  if (!file || !file.type.startsWith("image/")) {
    return file;
  }

  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const compressed = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".jpg"),
            { type: "image/jpeg", lastModified: Date.now() }
          );

          resolve(compressed.size < file.size ? compressed : file);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export async function compressImageFiles(files, options) {
  if (!files || !files.length) {
    return files;
  }

  return Promise.all(Array.from(files).map((file) => compressImageFile(file, options)));
}
