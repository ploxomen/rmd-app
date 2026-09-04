import BanerModule from "@/components/BanerModule";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import ListProductionOrder from "@/components/orders/production/list/ListProductionOrder";
import { verifUser } from "@/helpers/verifUser";

export async function getServerSideProps(context) {
  return await verifUser(context, "/order/production/list");
}
export default function ListOrderProduction({
  dataUser,
  dataModules,
  dataRoles,
}) {
  return (
    <LoyoutIntranet
      title="Mis Órdenes de Producción"
      description=""
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 17.jpg"
        title="Lista Órdenes de Producción"
      />
      <ListProductionOrder />
    </LoyoutIntranet>
  )
}
