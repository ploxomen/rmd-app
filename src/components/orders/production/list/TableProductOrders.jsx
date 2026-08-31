import Badge from "@/components/Badge";
import { ButtonDangerSm } from "@/components/Buttons";
import TableIntranet from "@/components/TableIntranet";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

export default function TableProductOrders({ productOrders = [] }) {
  const columns = [
    "Nº Orden",
    "Fecha emisión",
    "Cliente",
    "Pedido(s) asociado(s)",
    "Horas previstas",
    "Entrega",
    "Acciones",
  ];
  return (
    <TableIntranet columns={columns}>
      {!productOrders.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron ordenes de producción
          </td>
        </tr>
      ) : (
        productOrders.map((product) => (
          <tr className="bg-white dark:bg-gray-800 text-xs" key={product.id}>
            <td className="p-1 text-center">
              {product.order_production_code}
            </td>
            <td className="p-1 text-center">{product.order_produc_date_issue}</td>
            <td className="p-1 text-center">{product.customer_name}</td>
            <td className="p-1 text-center">{product.orders_code?.split(",").map(txt => <Badge text={txt} colors="bg-blue-100 bg-blue-500"/>)}</td>
            <td className="p-1 text-center">{product.order_produc_total}h</td>
            <td className="p-1 text-center">{product.order_produc_date_delive}</td>
            <td className="p-1">
              <div className="flex gap-1 flex-wrap justify-center">
                <Link
                  className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white"
                  href={{
                    pathname: `/intranet/store/commodity/histories`,
                    query: {
                      commodity: product.id,
                    },
                  }}
                  title="Ver historial"
                >
                  <PencilIcon className="w-4 h-4" />
                </Link>
                <ButtonDangerSm
                //   onClick={(e) => deleteHistory(product.id)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  title="Eliminar orden de producción"
                />
              </div>
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}
