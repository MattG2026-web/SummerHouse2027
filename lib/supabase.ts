// Server-only helper for calling Supabase RPC endpoints.
// The anon key below is safe to be present in server-side code (Supabase's
// anon key is designed to be a public identifier — the real access control
// happens inside the Postgres functions it calls, via RLS + the admin
// secret). This file must never be imported from a "use client" component.

const SUPABASE_URL = "https://hefxuamtrjgdnrfpufpz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZnh1YW10cmpnZG5yZnB1ZnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzA5MzYsImV4cCI6MjA5Nzk0NjkzNn0.dZ6ict2NtyBVIoqyWc13ygK3W_Aqin4klzno3XgKZwY";

const GALLERY_BUCKET = "summerhouse-gallery";

// Shared secret required by every admin-mutating Postgres function.
// Set as an ADMIN_SECRET environment variable in Vercel (Project Settings ->
// Environment Variables) — never hardcoded here so it can't leak via git.
// Change this AND the `admin_secret` row in the `summerhouse.settings`
// table together if you ever want to rotate it.
export const ADMIN_SECRET = process.env.ADMIN_SECRET as string;

// A separate, lower-privilege passcode for the housekeeper: read-only
// (names, dates, room notes) — no prices, no phone numbers, no admin actions.
// Set as a HOUSEKEEPER_SECRET environment variable in Vercel.
export const HOUSEKEEPER_SECRET = process.env.HOUSEKEEPER_SECRET as string;

export class RpcError extends Error {}

export async function callRpc<T = unknown>(
  fn: string,
  args: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const message =
      (parsed && typeof parsed === "object" && "message" in parsed
        ? (parsed as { message?: string }).message
        : undefined) || text || `RPC ${fn} failed (${res.status})`;
    throw new RpcError(message);
  }

  return parsed as T;
}

// Uploads a single photo to Supabase Storage from server-side code (a
// Server Action running on Vercel — it has normal internet access).
// Returns the public URL and the storage path (needed later for delete).
export async function uploadGalleryPhoto(
  fileName: string,
  contentType: string,
  bytes: ArrayBuffer
): Promise<{ url: string; path: string }> {
  const safeName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${GALLERY_BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": contentType || "application/octet-stream",
        "x-upsert": "false",
      },
      body: bytes,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new RpcError(text || `Upload failed (${res.status})`);
  }

  const url = `${SUPABASE_URL}/storage/v1/object/public/${GALLERY_BUCKET}/${path}`;
  return { url, path };
}

export async function deleteGalleryPhoto(path: string): Promise<void> {
  if (!path) return;
  await fetch(`${SUPABASE_URL}/storage/v1/object/${GALLERY_BUCKET}/${path}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  }).catch(() => {
    // best-effort: if the blob delete fails, the DB row is still gone
  });
}
