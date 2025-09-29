// app/page.tsx
"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardPage from "./(protected)/dashboard/page";

export default function Home() {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!hasPermission("can_view_dashboard")) {
        router.push("/unauthorized"); // optional page
      } else {
        setAuthorized(true);
      }
    }
  }, [loading, user, hasPermission, router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading...
      </div>
    );
  }

  return <DashboardPage />;
}
