import { createHash } from "crypto";
import { cookies } from "next/headers";
import { ADMIN_SECRET, HOUSEKEEPER_SECRET } from "./supabase";

const COOKIE_NAME = "sh_admin";
const HK_COOKIE_NAME = "sh_housekeeper";

function sessionToken(): string {
  return createHash("sha256").update(`${ADMIN_SECRET}:session`).digest("hex");
}

export function isAdminRequest(): boolean {
  const store = cookies();
  const cookie = store.get(COOKIE_NAME);
  return !!cookie && cookie.value === sessionToken();
}

export function adminCookie() {
  return {
    name: COOKIE_NAME,
    value: sessionToken(),
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days
  };
}

export function clearedAdminCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

function housekeeperSessionToken(): string {
  return createHash("sha256").update(`${HOUSEKEEPER_SECRET}:hk-session`).digest("hex");
}

export function isHousekeeperRequest(): boolean {
  const store = cookies();
  const cookie = store.get(HK_COOKIE_NAME);
  return !!cookie && cookie.value === housekeeperSessionToken();
}

export function housekeeperCookie() {
  return {
    name: HK_COOKIE_NAME,
    value: housekeeperSessionToken(),
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // 180 days
  };
}

export function clearedHousekeeperCookie() {
  return {
    name: HK_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
