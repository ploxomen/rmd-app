import apiAxios from "@/axios";
import { sweetAlert } from "./getAlert";
import { getCookie } from "./getCookie";

export const getDistrics = async (province) =>{
    const headers = getCookie();
    try {
        const resp = await apiAxios.get(`/districts/${province}`, { headers });
        return resp.data.data;
      } catch (error) {
        console.error(error);
        sweetAlert({ title: "Error", text: "Error al obtener los distritos", icon: "error" });;
      }
}