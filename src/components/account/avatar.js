const MAX_SIDE = 256;
const MAX_BYTES = 60 * 1024;

const approxBytes = (dataUrl) => Math.ceil((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);

function load(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("That file isn’t a readable image."));
        };
        img.src = url;
    });
}

/** Centre-crops to a square, scales to <= 256px and re-encodes as JPEG under ~60 KB. */
export async function fileToAvatarDataUrl(file) {
    if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPG, PNG or WebP).");
    const img = await load(file);

    const side = Math.min(img.width, img.height);
    const size = Math.min(MAX_SIDE, side);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);

    let quality = 0.88;
    let out = canvas.toDataURL("image/jpeg", quality);
    while (approxBytes(out) > MAX_BYTES && quality > 0.3) {
        quality -= 0.1;
        out = canvas.toDataURL("image/jpeg", quality);
    }
    if (approxBytes(out) > MAX_BYTES) throw new Error("That image is too detailed to shrink. Try a simpler photo.");
    return out;
}
