import BanerModule from "@/components/BanerModule";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import CartProductProgress from "@/components/stores/CartProductProgress";
import { verifUser } from "@/helpers/verifUser";
import React, { memo } from "react";
export async function getServerSideProps(context) {
  const userCookie = context.req.cookies;
  return await verifUser(userCookie, "/store/product-progress");
}
const ProductProgress = ({ dataModules, dataUser, dataRoles }) => {
  return (
    <LoyoutIntranet
      title="Inicio - Productos en curso"
      description="Inicio de productos en curso"
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 10.jpg"
        title="Inicio de productos en curso"
      ></BanerModule>
      <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
        <div className="flex justify-center flex-wrap gap-y-4 gap-x-10">
          <CartProductProgress
            url="products-progress/general"
            urlImg="/icons/features.png"
            title="Resumen almacen PC"
            description="Visualiza la cantidad acumulada de los productos en curso"
            altImg="Lista de tareas en caja"
          />

          <CartProductProgress
            url="products-progress/create"
            urlImg="/icons/report.png"
            title="Historial de movimientos"
            description="Visualiza todos los movimientos de los productos en curso"
            altImg="Lista de tareas"
          />
        </div>
      </div>
    </LoyoutIntranet>
  );
}
export default memo(ProductProgress);
