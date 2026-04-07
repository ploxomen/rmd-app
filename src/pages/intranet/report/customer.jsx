import apiAxios from "@/axios";
import ViewPdf from "@/components/ViewPdf";
import { useEffect, useState } from "react";

export default function ReportCustomer({title}) {
  const [pdfSrc, setPdfSrc] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiAxios.get("/customer/export/pdf", {
          responseType: "arraybuffer",
        });
        setPdfSrc(
          URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" }),
          ),
        );
      } catch (error) {
        return route.replace("/intranet/home");
      }
    };
    getData();
  }, []);
  return (
    <>
      {pdfSrc ? (
        <ViewPdf src={pdfSrc} title={title || "documento.pdf"} />
      ) : (
        <span>Cargando la cotización, por favor espere unos segundos...</span>
      )}
    </>
  );
}
