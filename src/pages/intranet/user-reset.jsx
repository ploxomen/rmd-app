import "@/app/globals.css";
import Head from "next/head";
import React, { useState } from "react";
import { InputLogin } from "@/components/Inputs";
import { ButtonDanger, ButtonPrimary } from "@/components/Buttons";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { getCookie } from "@/helpers/getCookie";
import apiAxios from "@/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { sweetAlert } from "@/helpers/getAlert";
export async function getServerSideProps(context) {
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  try {
    const req = await apiAxios.get("/user/modules-roles", {
      headers,
      params: { url: "/user-reset" },
    });
    if (req.data.redirect == "/intranet/user-reset") {
      return {
        props: {},
      };
    }
    return {
      redirect: {
        destination: "/intranet/home",
        permanent: false,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
function UserReset() {
  const headers = getCookie();
  const [form, setForm] = useState({
    password_1: "",
    password_2: "",
  });
  const route = useRouter();
  const handleCloseSession = async () => {
    const question = await sweetAlert({
      title: "Mensaje",
      text: "¿Deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
    });
    if (!question.isConfirmed) {
      return;
    }
    try {
      const resp = await apiAxios.delete("/user/logout", { headers });
      if (!resp.error) {
        document.cookie = "authenticate=;Max-Age=0;path=/";
      }
      return route.replace("/login");
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: "Error",
        text: "Error al cerrar sesión",
        icon: "error",
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password_1.length < 8) {
      return sweetAlert({
        title: "Alerta",
        text: "La contraseña debe contener al menos 8 caracteres",
        icon: "warning",
      });
    }
    if (form.password_1 != form.password_2) {
      return sweetAlert({
        title: "Alerta",
        text: "Las contraseñas no coinciden",
        icon: "warning",
      });
    }
    try {
      const resp = await apiAxios.put(`/user/change-password`, form, {
        headers,
      });
      if (resp.data.error) {
        return sweetAlert({
          title: "Alerta",
          text: resp.data.message,
          icon: "warning",
        });
      }
      Cookies.remove("authenticate", { path: "" });
      Cookies.set("authenticate", JSON.stringify(resp.data.data), {
        path: "/",
      });
      return route.replace(resp.data.redirect);
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: "Error",
        text: "Error al cambiar la contraseña",
        icon: "error",
      });
    }
  };
  const handleChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <Head>
        <title>Cambio de contraseña</title>
      </Head>
      <div className="bg-layout p-5 flex justify-center items-center min-h-dvh">
        <div className="bg-white px-4 py-7 max-w-md rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <img
                src="/img/logo.jpg"
                width={120}
                height={120}
                className="m-auto"
              />
            </div>
            <div className="mb-5">
              <small className="text-sm text-paragraph">
                Su cuenta a sido restaurada por un administrador o es la primera
                vez que ingresa al sistema, por favor establesca una contraseña
                para acceder al sistema
              </small>
            </div>
            <InputLogin
              label="Contraseña"
              type="password"
              name="password_1"
              value={form.password_1 || ""}
              onChange={handleChangeForm}
            />
            <InputLogin
              label="Repetir contraseña"
              type="password"
              name="password_2"
              value={form.password_2 || ""}
              onChange={handleChangeForm}
            />
            <div className="mb-1 text-center">
              <ButtonPrimary
                text="Ingresar"
                type="submit"
                icon={<ArrowRightEndOnRectangleIcon className="w-6 h-6" />}
              />
              <ButtonDanger
                text="Salir"
                icon={<ArrowLeftEndOnRectangleIcon className="w-6 h-6" />}
                onClick={handleCloseSession}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserReset;
