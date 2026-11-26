"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Re-check the session whenever the route changes (after login, logout, etc.)
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) {
          setUser(d.user);
          setReady(true);
        }
      })
      .catch(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const link = "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] text-white">
            ✦
          </span>
          <span>SiteCopy AI</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {ready && user && (
            <>
              <Link href="/dashboard" className={link}>
                Dashboard
              </Link>
              <span className="hidden text-sm text-slate-500 md:inline">Hi, {user.name}</span>
              <button onClick={logout} className={link}>
                Log out
              </button>
            </>
          )}
          {ready && !user && (
            <>
              <Link href="/login" className={link}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium transition hover:bg-slate-50 sm:block"
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            href="/builder"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Start building
          </Link>
        </nav>
      </div>
    </header>
  );
}