import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

export interface StorageProvider {
  upload(file: File, folder: string): Promise<{ url: string }>;
}

/**
 * Dev-mode provider: writes to /public/uploads so files are served directly
 * by Next.js. Swap this for an S3/R2-backed provider in production — the
 * StorageProvider interface is the only thing callers depend on.
 */
class LocalDiskStorageProvider implements StorageProvider {
  async upload(file: File, folder: string): Promise<{ url: string }> {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || "";
    const filename = `${randomBytes(8).toString("hex")}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);
    return { url: `/uploads/${folder}/${filename}` };
  }
}

export const storage: StorageProvider = new LocalDiskStorageProvider();

export async function uploadIfPresent(
  file: File | null,
  folder: string,
): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const { url } = await storage.upload(file, folder);
  return url;
}
