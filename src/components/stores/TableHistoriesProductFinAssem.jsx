import React from "react";
import TableIntranet from "../TableIntranet";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { parseMoney } from "@/helpers/utilities";

export default function TableHistoriesProductFinAssem({
  histories = [],
  deleteHistory = () => {},
  getHistory = () => {},
}) {
  const columns = [
    "Codigo",
    "Fecha - Ingreso / Salida",
    "Cantidad",
    "Unidad",
    "valor ensamblaje",
    "Justificacion",
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
            <td className="p-1 text-center">
              {history.product_finaly_created}
            </td>
            <td className="p-1 text-center">{history.product_finaly_amount}</td>
            <td className="p-1 text-center">
              {
                optionsUnitsMeasurements.find(
                  (unit) => unit.value === history.product_unit_measurement
                )?.label
              }
            </td>
            <td className="p-1 text-center">{parseMoney(history.product_finaly_total,'PEN')}</td>
            <td className="p-1 text-center">
              {history.product_finaly_description}
            </td>
            <td className="p-1">
              {!history.quotation_detail_id && (
                <div className="flex gap-1 flex-wrap justify-center">
                  <ButtonPrimarySm
                    onClick={(e) => getHistory(history.id)}
                    icon={<PencilIcon className="size-4" />}
                    title="Editar historial"
                  />
                  <ButtonDangerSm
                    onClick={(e) => deleteHistory(history.id)}
                    icon={<TrashIcon className="size-4" />}
                    title="Eliminar historial"
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
