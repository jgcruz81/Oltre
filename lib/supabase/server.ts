import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Custom cookie handler (fixing the return type issue)
const customCookieMethods = (cookieStore: ReturnType<typeof cookies>) => {
  return {
    get: (name: string) => {
      const cookie = cookieStore.get(name);
      return cookie ? cookie.value : null; // Return the cookie value as a string or null
    },
    set: (name: string, value: string, options?: { maxAge?: number }) => {
      cookieStore.set(name, value, options);
    },
    setAll: (cookiesToSet: { name: string, value: string, options?: { maxAge?: number } }[]) => {
      cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
    },
  };
};

// Your server-side Supabase client setup
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  const cookieMethods = customCookieMethods(cookieStore);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods,
    }
  );
};
