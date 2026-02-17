import React from "react";
import TableIntranet from "../TableIntranet";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function TableChangeMoney({
    data = [],
    getChangeMoney = () => {},
    deleteChangeMoney = () => {}
}) {
    const columns = [
        'dia',
        'tipo de cambio',
        'intentos',
        'acciones'
    ]
  return (
    <TableIntranet columns={columns}>
      {!data.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron tipos de cambios
          </td>
        </tr>
      ) : (
        data.map((money) => (
          <tr className="bg-white dark:bg-gray-800" key={money.id}>
            <td className="py-2 px-4">{money.change_day}</td>
            <td className="py-2 px-4">{money.change_soles}</td>
            <td className="py-2 px-4">{money.change_attempts}</td>           
            <td className="py-2 px-4">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  text="Editar"
                  onClick={(e) => getChangeMoney(money.change_day)}
                  icon={<PencilIcon className="w-4 h-4" />}
                />
                <ButtonDangerSm
                  text="Eliminar"
                  onClick={(e) => deleteChangeMoney(money.change_day)}
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
