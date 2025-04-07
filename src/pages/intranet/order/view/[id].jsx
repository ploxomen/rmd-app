import apiAxios from '@/axios';
import '@/app/globals.css';
import ViewPdf from '@/components/ViewPdf'
import { getCookie } from '@/helpers/getCookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
export async function getServerSideProps(context){
  return {
    props : {
      id:context.query.id,
      title:context.query.fileName
    }
  }
}
function ReportQuotation({id,title}) {
  const [pdfSrc, setPdfSrc] = useState(null);
  const headers = getCookie();
  const route = useRouter();
  useEffect(() => {
    const getData = async() => {
      try {
        const response = await apiAxios.get("/order-extra/pdf/" + id,{
          headers,
          responseType:'arraybuffer'
        });
        setPdfSrc(URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })));
      } catch (error) {
        return route.replace('/intranet/home');
      }
    }
    getData();
  },[])
  return (
    <>
    {pdfSrc ? (
      <ViewPdf src={pdfSrc} title={title||"documento.pdf"}/>
    ) : <span>Cargando el pedido, por favor espere unos segundos...</span>}
    </>
  );
}
export default ReportQuotation