import React from "react";
import TableIntranet from "../TableIntranet";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function TableHistoryMaterial({ histories, deleteHistory, viewHistory}) {
  const columns = [
    "Código",
    "N° Factura",
    "N° Guia",
    "Cantidad",
    "P. Compra",
    "I.G.V",
    "Total",
    "Usuario",
    "Acciones",
  ];
  return (
    <TableIntranet columns={columns}>
      {!histories.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron historiales
          </td>
        </tr>
      ) : (
        histories.map((history) => (
          <tr className="bg-white dark:bg-gray-800" key={history.id}>
            <td className="py-2 px-4 text-center">
              {history.id.toString().padStart(3, "0")}
            </td>
            <td className="py-2 px-4">{history.material_hist_bill}</td>
            <td className="py-2 px-4">{history.material_hist_guide}</td>
            <td className="py-2 px-4">{history.material_hist_amount}</td>
            <td className="py-2 px-4">
              {parseMoney(
                history.material_hist_price_buy,
                history.material_hist_money
              )}
            </td>
            <td className="py-2 px-4">
              {parseMoney(
                history.material_price_igv,
                history.material_hist_money
              )}
            </td>
            <td className="py-2 px-4">
              {parseMoney(
                history.material_hist_total_buy,
                history.material_hist_money
              )}
            </td>
            <td className="py-2 px-4">{history.user_name}</td>
            <td className="py-2 px-4">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  text="Editar"
                  onClick={(e) => viewHistory(history.id)}
                  icon={<PencilIcon className="w-4 h-4" />}
                />
                <ButtonDangerSm
                  text="Eliminar"
                  onClick={(e) => deleteHistory(history.id)}
                  icon={<TrashIcon className="w-4 h-4" />}
                />
              </div>
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}

export default TableHistoryMaterial;
