import React from "react";
import TableIntranet from "../TableIntranet";
import { ButtonDangerSm, ButtonSecondarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function TableReferralGuide({
  guides = [],
  deleteGuide = () => {},
  getGuide = () => {},
}) {
    const columns = [
        "Fecha emisión",
        "N° de guía",
        "Cliente",
        "Dirección de destino",
        "Justificación",
        "Total Productos",
        "Acciones",
      ];
  return <TableIntranet columns={columns}>
  {!guides.length ? (
    <tr className="bg-white dark:bg-gray-800">
      <td colSpan="100%" className="text-center font-bold">
        No se registraron guias de remisión
      </td>
    </tr>
  ) : (
    guides.map((guide) => (
      <tr className="bg-white dark:bg-gray-800 text-xs" key={guide.id}>
        <td className="p-1 text-center">
          {guide.guide_issue_date}
        </td>
        <td className="p-1 text-center">GR{guide.guide_issue_year}-{guide.guide_issue_number.toString().padStart(3,"0")}</td>
        <td className="p-1 text-center">{guide.customer_name}</td>
        <td className="p-1 text-center">{guide.guide_address_destination}</td>
        <td className="p-1 text-center">{guide.guide_justification}</td>
        <td className="p-1 text-center">{guide.guite_total}</td>
        <td className="p-1">
          <div className="flex gap-1 flex-wrap justify-center">
            <ButtonSecondarySm
              onClick={(e) => getGuide(guide.id)}
              icon={<PencilIcon className="size-4" />}
              title="Editar guia de remisión"
            />
            <ButtonDangerSm
              onClick={(e) => deleteGuide(guide.id)}
              icon={<TrashIcon className="size-4" />}
              title="Eliminar guia de remisión"
            />
          </div>
        </td>
      </tr>
    ))
  )}
</TableIntranet>;
}
