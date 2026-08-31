import BanerModule from "@/components/BanerModule";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import FormProductionOrder from "@/components/orders/production/form/FormProductionOrder";
import { verifUser } from "@/helpers/verifUser";
import { useRouter } from "next/router";
import React from "react";

export async function getServerSideProps(context) {
  return await verifUser(context, "/order/production/list");
}
export default function FormOrderProduction({
  dataUser,
  dataModules,
  dataRoles
}) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <LoyoutIntranet
      title="Formulario orden de producción"
      description=""
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 17.jpg"
        title="Formulario Orden de producción"
      />
      <FormProductionOrder id={id} />
    </LoyoutIntranet>
  );
}
