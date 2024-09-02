import apiAxios from "@/axios";
import { sweetAlert } from "./getAlert";
import { getCookie } from "./getCookie";

export const getProvinces = async (departament) =>{
    const headers = getCookie();
    try {
        const resp = await apiAxios.get(`/provinces/${departament}`, { headers });
        return resp.data.data;
      } catch (error) {
        console.error(error);
        sweetAlert({ title: "Error", text: "Error al obtener las provincias", icon: "error" });;
      }
}