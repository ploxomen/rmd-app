import api from "@/libs/axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "Inicioar sesión",
  description: "Login page",
};
export default async function LayoutAccount({ children }) {
  const headersList = headers();
  try {
    const response = await api.get("/api/user/modules-roles", {
      headers: {
        Cookie: headersList.get("cookie"),
        Origin: process.env.APP_URL,
      },
      params: { url: "/home" },
    });
    if (response.status === 200) {
      return redirect(process.env.NEXT_PUBLIC_URI_LOGIN);
    }
  } catch (error) {
    console.log(error);
  }
  
  return (
    <div
      className="bg-layout p-5 flex justify-center items-center min-h-dvh"
      style={{
        backgroundImage: "url('/img/login-fondo.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white px-4 py-7 max-w-md rounded-lg shadow-md">
        <img src="/img/logo.jpg" width={120} height={120} className="m-auto" />
        {children}
      </div>
    </div>
  );
}
