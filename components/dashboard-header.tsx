// components/dashboard-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AuthService } from "@/lib/AuthService";
import { User } from "@/types";
import { LogOut, User2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardHeader({ user }: { user?: User | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    await AuthService.logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-blue-400 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white dark:text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <User2 className="size-4 text-white dark:text-gray-300" />
              </div>
              <span className="text-sm font-medium text-white dark:text-gray-300">
                {user.first_name} {user.last_name}
              </span>
            </div>
          )}

          <Button
            variant="brand"
            onClick={handleLogout}
            // className="text-gray-600 hover:bg-red-400 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut className="mr-2 size-5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
