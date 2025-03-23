import crypto from "crypto";

export function getVideoIdRange(videoId: string): number {
    const hash = crypto.createHash("md5").update(videoId).digest("hex");
    const hashValue = parseInt(hash.substring(0, 8), 16); // First 8 hex characters to number
    return hashValue % 1000; // Partition to 1000 ranges
}
