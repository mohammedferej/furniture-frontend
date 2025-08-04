import LoginPage from "@/components/LoginPage";

export default function Login() {
  return (
    <main className="ocean flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-r from-blue-400 to-yellow-600 ">
      <div className="ml-0 wave animate-wave" />
      <div className="ml-0 wave animate-swell" />
      <h1 className="addislandcss">Ordering System</h1>
      <LoginPage />
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left" />
      <div className="ml-0 wave animate-wave" />
      <div className="ml-0 wave animate-swell" />
    </main>
  );
}