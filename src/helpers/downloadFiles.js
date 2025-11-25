import apiAxios from "@/axios";
import { sweetAlert } from "./getAlert";

export const downloadFiles = async (urlApi = "", nameFile = "", params = {}) => {
  try {
    const resp = await apiAxios.get(urlApi, {
      responseType: "blob",
      params
    });
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${nameFile}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
    sweetAlert({
      title: "Error",
      text: "Error al exportar la data",
      icon: "error",
    });
  }
};
