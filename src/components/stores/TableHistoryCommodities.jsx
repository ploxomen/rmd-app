import React from "react";
import TableIntranet from "../TableIntranet";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function TableHistoryCommodities({
  histories = [],
  deleteHistory = () => {},
  viewHistory = () => {},
}) {
  const columns = [
    "fecha",
    "Código",
    "Tipo",
    "N° Guia",
    "Justificacion",
    "Cantidad",
    "P. Uni.",
    "promedio almacen",
    "Total $",
    "Tipo cambio",
    "Total S/",
    "Usuario",
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
            <td className="p-1 text-center">{history.commodi_hist_date}</td>
            <td className="p-1 text-center">
              {history.id.toString().padStart(3, "0")}
            </td>
            <td className="p-1 text-center">{history.commodi_hist_type}</td>
            <td className="p-1 text-center">{history.commodi_hist_guide}</td>
            <td className="p-1 text-center">{history.justification}</td>
            <td className="p-1 text-center">{history.commodi_hist_amount}</td>
            <td className="p-1 text-center">
              {parseMoney(
                history.commodi_hist_money === "USD"
                  ? parseFloat(
                      history.commodi_hist_total_buy_usd /
                        history.commodi_hist_amount
                    ).toFixed(2)
                  : history.commodi_hist_price_buy,
                history.commodi_hist_money
              )}
            </td>
            <td className="p-1 text-center">
              {history.commodi_hist_prom_weig}
            </td>
            <td className="p-1 text-center">
              {history.commodi_hist_money === "USD"
                ? parseMoney(history.commodi_hist_total_buy_usd, "USD")
                : parseMoney(0, "USD")}
            </td>
            <td className="p-1 text-center">
              {history.commodi_hist_type_change}
            </td>
            <td className="p-1 text-center">
              {parseMoney(history.commodi_hist_total_buy, "PEN")}
            </td>
            <td className="p-1 text-center">{history.user_name}</td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}

export default TableHistoryCommodities;
