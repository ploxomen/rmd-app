import BanerModule from "@/components/BanerModule";
import ButtonReport from "@/components/ButtonReport";
import { InputPrimary } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import { downloadFiles } from "@/helpers/downloadFiles";
import { verifUser } from "@/helpers/verifUser";
import React, { useState } from "react";
export async function getServerSideProps(context) {
  return await verifUser(context, "/report/global");
}
const INITIAL_FILTER = {
  date_initial: new Date().toISOString().split("T")[0],
  date_finaly: new Date().toISOString().split("T")[0],
};
export default function Global({ dataModules, dataUser, dataRoles }) {
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const handlerChangeFilter = (e) => {
    setFilter((filter) => ({ ...filter, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <LoyoutIntranet
        title="Reportes"
        description="Administración de reportes"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule imageBanner="/baners/Group 11.jpg" title="Reportes" />
        <form className="grid bg-white px-4 py-2 rounded-lg mb-6 grid-cols-12 gap-4">
          <div className="col-span-full md:col-span-4">
            <InputPrimary
              label="Fecha inicio"
              type="date"
              name="date_initial"
              value={filter.date_initial}
              onChange={handlerChangeFilter}
            />
          </div>
          <div className="col-span-full md:col-span-4">
            <InputPrimary
              label="Fecha fin"
              value={filter.date_finaly}
              name="date_finaly"
              type="date"
              onChange={handlerChangeFilter}
            />
          </div>
        </form>
        <div className="bg-white px-4 py-6 rounded-lg flex justify-center flex-wrap gap-y-4 gap-x-10">
          <ButtonReport
            urlImg="/icons/features.png"
            title="Reporte de compra"
            description="Visualiza las compras realizadas"
            onClick={e => downloadFiles("/shopping-export","compras",filter)}
          />
          <ButtonReport
            urlImg="/icons/report.png"
            title="Movimientos - entrada"
            description="Visualiza todos los movimientos de los productos de entrada"
            onClick={e => downloadFiles("/entry-export","movimientos_entradas",filter)}
          />
          <ButtonReport
            urlImg="/icons/report.png"
            title="Movimientos - salida"
            description="Visualiza todos los movimientos de los productos de salida"
            onClick={e => downloadFiles("/exit-export","movimientos_salidas",filter)}
          />
        </div>
      </LoyoutIntranet>
    </>
  );
}
