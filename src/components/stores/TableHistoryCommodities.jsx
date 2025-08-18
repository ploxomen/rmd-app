import React from "react";
import TableIntranet from "../TableIntranet";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function TableHistoryCommodities({ histories = [], deleteHistory = () => {}, viewHistory = () => {}}) {
  const columns = [
    "Código",
    "Tipo",
    "N° Factura",
    "N° Guia",
    "Cantidad",
    "P. Uni.",
    "Total S/",
    "Saldo Cant.",
    "Saldo Cost.",
    "Promedio",
    "Total $",
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
          <tr className="bg-white dark:bg-gray-800 text-xs" key={history.id}>
            <td className="p-1 text-center">
              {history.id.toString().padStart(3, "0")}
            </td>
            <td className="p-1 text-center">{history.commodi_hist_type}</td>
            <td className="p-1 text-center">{history.commodi_hist_bill}</td>
            <td className="p-1 text-center">{history.commodi_hist_guide}</td>
            <td className="p-1 text-center">{history.commodi_hist_amount}</td>
            <td className="p-1 text-center">
              {
                parseMoney(
                  history.commodi_hist_price_buy,
                  'PEN'
                )}
            </td>
            <td className="p-1 text-center">
              {
                parseMoney(
                  history.commodi_hist_total_buy,
                  'PEN'
                )}
            </td>
            <td className="p-1 text-center">
              {history.commodi_hist_bala_amou}
            </td>
            <td className="p-1 text-center">
              {parseMoney(history.commodi_hist_bala_cost,'PEN')}
            </td>
            <td className="p-1 text-center">
              {history.commodi_hist_prom_weig}
            </td>
            <td className="p-1 text-center">
              {parseMoney(history.commodi_hist_total_buy_usd, "USD")}
            </td>
            <td className="p-1 text-center">{history.user_name}</td>
            <td className="p-1">
              {history.guide_refer_id ? (
                "Sin acciones"
              ) : (
                <div className="flex gap-1 flex-wrap justify-center">
                  <ButtonPrimarySm
                    onClick={(e) => viewHistory(history.id)}
                    icon={<PencilIcon className="w-4 h-4" />}
                    title="Editar historial"
                  />
                  <ButtonDangerSm
                    onClick={(e) => deleteHistory(history.id)}
                    title="Eliminar historial"
                    icon={<TrashIcon className="w-4 h-4" />}
                  />
                </div>
              )}
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}

export default TableHistoryCommodities;
