import { supabase } from "@/lib/supabaseClient";

/** Must match a public bucket in Supabase Dashboard → Storage. */
export const AVATAR_BUCKET = "avatars";

const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

export function validateAvatarFile(file: File): string | null {
  if (file.size > MAX_BYTES) return "File is too large (max 15MB).";
  if (!ALLOWED.has(file.type)) return "Use PNG, JPEG, or WebP.";
  return null;
}

/**
 * Uploads to `avatars/{userId}/...` and returns public URL.
 * Create bucket `avatars` (public) and run `supabase/avatars-storage.sql` in the SQL editor.
 */
export async function uploadProfileAvatar(
  file: File,
  userId: string,
): Promise<{ publicUrl: string; path: string } | { error: string }> {
  const v = validateAvatarFile(file);
  if (v) return { error: v };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safe = /^[a-z0-9]+$/i.test(ext) ? ext : "jpg";
  const path = `${userId}/avatar-${Date.now()}.${safe}`;

  const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "image/jpeg",
  });

  if (upErr) {
    if (upErr.message?.includes("Bucket not found") || upErr.message?.includes("not found")) {
      return {
        error:
          "Storage bucket is not set up yet. In Supabase → Storage, create a public bucket named “avatars” and run the policy SQL in supabase/avatars-storage.sql in the project.",
      };
    }
    return { error: upErr.message };
  }

  const { data: pub } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return { publicUrl: pub.publicUrl, path };
}

export async function removeProfileAvatarFromStorage(avatarPath: string): Promise<void> {
  if (!avatarPath) return;
  await supabase.storage.from(AVATAR_BUCKET).remove([avatarPath]);
}
