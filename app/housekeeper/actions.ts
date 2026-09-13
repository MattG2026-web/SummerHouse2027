"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HOUSEKEEPER_SECRET } from "@/lib/supabase";
import { housekeeperCookie, clearedHousekeeperCookie } from "@/lib/auth";

export async function housekeeperLoginAction(formData: FormData) {
  const passcode = String(formData.get("passcode") || "");
  if (passcode !== HOUSEKEEPER_SECRET) {
    redirect("/housekeeper?error=1");
  }
  const c = housekeeperCookie();
  cookies().set(c.name, c.value, c);
  redirect("/housekeeper");
}

export async function housekeeperLogoutAction() {
  const c = clearedHousekeeperCookie();
  cookies().set(c.name, c.value, c);
  redirect("/housekeeper");
}
