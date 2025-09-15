"use client";

import LoginPage from "@/components/LoginPage";

export default function Login() {
  return (
    <main className="ocean flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 bg-gradient-to-r from-blue-400 to-yellow-600">
      <div className="ml-0 wave animate-wave" />
      <div className="ml-0 wave animate-swell" />

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
        Ordering System
      </h1>

      <LoginPage />

      <div className="ml-0 wave animate-wave" />
      <div className="ml-0 wave animate-swell" />
    </main>
  );
}
