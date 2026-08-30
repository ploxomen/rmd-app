import BanerModule from "@/components/BanerModule";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import FormProductionOrder from "@/components/orders/production/form/FormProductionOrder";
import { verifUser } from "@/helpers/verifUser";
import React from "react";

export async function getServerSideProps(context) {
  return await verifUser(context, "/order/production/form");
}
export default function FormOrderProduction({
  dataUser,
  dataModules,
  dataRoles,
}) {
  return (
    <LoyoutIntranet
      title="Generar orden de produccón"
      description=""
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 17.jpg"
        title="Administración de pedidos"
      />
      <FormProductionOrder />
    </LoyoutIntranet>
  );
}
