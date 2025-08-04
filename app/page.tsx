
"use client"
import Image from "next/image";
import DashboardPage from "./(protected)/dashboard/page";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "@/constants";
import { AuthService } from "@/lib/services";
import Cookies  from 'js-cookie'
import { redirect } from "next/navigation";
export default function Home() {

    const  [loading, setLoading] = useState(true);
     const [ user,setUser]  = useState<null | User>(null);
     
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = Cookies.get(ACCESS_TOKEN);
      if (accessToken) {
        try {
          const res = await AuthService.getUserProfile();
          if (res) {
            setUser(res);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          AuthService.logout();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  if (loading) {
    return <div className=' min-h-screen flex items-center justify-center font-bold bg-gray-100'>Loading...</div>;
  }

  if (!user && !loading) {
    return redirect('/login');
  }
  return (
 <div className=" font-semibold text-2xl text-center mt-10 w-full">
  <DashboardPage/>
 </div>
  );
}
