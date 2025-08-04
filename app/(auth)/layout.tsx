import React from 'react'
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const AuthLayout = ({
    children
}:{
    children:React.ReactNode
}) => {
  return (
    <div   className={clsx(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}>

         <div className="relative flex flex-col h-screen">
          <main className="w-full flex-grow">{children}</main>
        </div>
    </div>
  )
}

export default AuthLayout