import { parseMoney } from "@/helpers/utilities";
import React from "react";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import TableIntranet from "../TableIntranet";

export default function TableShopping({
  shopping = [],
  viewBuy = () => {},
  deleteBuy = () => {},
}) {
  const columns = [
    "fecha",
    "proveedor",
    "n° factura",
    "n° guía",
    "total",
    "tipo",
    "acciones",
  ];
  return (
    <TableIntranet columns={columns}>
      {!shopping.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron compras
          </td>
        </tr>
      ) : (
        shopping.map((buy) => (
          <tr className="bg-white dark:bg-gray-800 text-xs" key={buy.id}>
            <td className="p-1 text-center">{buy.buy_date}</td>
            <td className="p-1 text-center">{buy.buy_provider}</td>
            <td className="p-1 text-center">{buy.buy_number_invoice}</td>
            <td className="p-1 text-center">{buy.buy_number_guide}</td>
            <td className="p-1 text-center">{buy.buy_type}</td>
            <td className="p-1">{parseMoney(buy.buy_total, "PEN")}</td>
            <td className="p-1">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  onClick={(e) => viewBuy(buy.id)}
                  icon={<PencilIcon className="size-4" />}
                  title="Editar comprado"
                />
                <ButtonDangerSm
                  onClick={(e) => deleteBuy(buy.id)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  title="Eliminar producto terminado"
                />
              </div>
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}
