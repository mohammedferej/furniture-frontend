'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Home, Settings, ChevronDown, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { FaJediOrder, FaTable } from "react-icons/fa";
import clsx from "clsx";

export function AppSidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "mejlis form", url: "/order-mejlis", icon: FaJediOrder },

    {title:"list order",url:"/orders",icon:FaTable},
  ];

  const settingsSubItems = [
    { title: "list", url: "/users" },
    { title: "add", url: "/register" },
  ];

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <Sidebar className="w-64 min-h-screen border-r bg-blue-400 dark:bg-blue-900 text-white">
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-3 border-b border-blue-500 dark:border-blue-700">
          Test
        </h2>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link
                  href={item.url}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    "hover:bg-blue-500 dark:hover:bg-blue-700",
                    pathname === item.url 
                      ? "bg-blue-700 dark:bg-blue-800 font-medium shadow-inner"
                      : "bg-transparent"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem className="mt-4">
              <button
                onClick={() => setSettingsOpen((prev) => !prev)}
                className={clsx(
                  "flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors",
                  "hover:bg-blue-500 dark:hover:bg-blue-700",
                  settingsOpen ? "bg-blue-500 dark:bg-blue-700" : "bg-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  <span>User</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 transition-transform",
                    settingsOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>
              
              {settingsOpen && (
                <SidebarMenuSub className="">
                  {settingsSubItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <Link
                        href={subItem.url}
                        className={clsx(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          "hover:bg-blue-500 dark:hover:bg-blue-700",
                          pathname === subItem.url 
                            ? "bg-blue-700 dark:bg-blue-800 font-medium shadow-inner"
                            : "bg-transparent"
                        )}
                      >
                        {subItem.title}
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-blue-500 dark:border-blue-700">
        <Button 
          variant="brand" 
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-2 text-white hover:bg-blue-500 dark:hover:bg-blue-700"
        >
          {darkMode ? (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
        
      </SidebarFooter>
    </Sidebar>
  );
}