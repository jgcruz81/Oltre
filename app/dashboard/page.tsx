"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardRouter() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function redirectToRoleDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role; // Assuming role is stored in user metadata
      if (role) {
        router.replace(`/dashboard/${role}`);
      } else {
        router.replace("/login"); // Redirect to login if no role is found
      }
    }

    redirectToRoleDashboard();
  }, [router, supabase]);

  return null; // Optional: loading spinner here
}