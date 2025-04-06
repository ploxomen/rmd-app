"use client";
import { ButtonLogin } from "@/components/Buttons";
import { InputLogin } from "@/components/Inputs";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import {  useState } from "react";
import { useLogin } from "./loginAction";
function PageLogin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { handleSubmit, alert, loading } = useLogin(user, password);
  return (
    <>
      {alert && (
        <div className="px-6 pt-2 pb-3 bg-red-100 rounded flex gap-2 items-center">
          <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
          <span className="text-red-500 text-sm">{alert}</span>
        </div>
      )}
      <div className="px-6 pt-2 pb-6 text-center">
        <h1 className="mb-1 font-medium text-2xl text-title">
          ¡Bienvenido al Sistema Integrado!
        </h1>
        <p className="text-base text-paragraph font-normal">
          Por favor inicie sesión con su cuenta proporcionada
        </p>
      </div>
      <form onSubmit={handleSubmit} className="px-6">
        <InputLogin
          name="username"
          label="Usuario"
          type="text"
          onChange={(e) => setUser(e.target.value)}
          value={user}
        />
        <InputLogin
          name="password"
          label="Contraseña"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div>
          <ButtonLogin text="Iniciar sesión" loading={loading} type="submit" />
        </div>
      </form>
    </>
  );
}

export default PageLogin;
