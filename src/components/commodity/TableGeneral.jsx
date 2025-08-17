import React from "react";
import TableIntranet from "../TableIntranet";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function TableGeneral({
  products = [],
  addHistory = () => {},
  deleteHistory = () => {},
}) {
  const columns = [
    "codigo",
    "producto",
    "etiqueta",
    "stock",
    "unidad",
    "costo compra",
    "acciones"
  ];
  return (
    <TableIntranet columns={columns}>
      {!products.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron productos
          </td>
        </tr>
      ) : (
        products.map((product) => (
          <tr className="bg-white dark:bg-gray-800 text-xs" key={product.id}>
            <td className="p-1 text-center">
              {product.product_code.toString().padStart(3, "0")}
            </td>
            <td className="p-1 text-center">{product.product_name}</td>
            <td className="p-1 text-center">{product.product_label_2}</td>
            <td className="p-1 text-center">{product.commodi_stock}</td>
            <td className="p-1 text-center">
              {
                optionsUnitsMeasurements.find(
                  (unit) => unit.value === product.product_unit_measurement
                )?.label
              }
            </td>
            <td className="p-1">
              {parseMoney(product.commodi_price_buy, "PEN")}
            </td>
            <td className="p-1">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  onClick={(e) => addHistory(product.id,product.product_name)}
                  icon={<PlusIcon className="w-4 h-4" />}
                  title="Agregar historial"
                />
                <Link
                  className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white"
                  href={{
                    pathname: `/intranet/store/commodity/histories`,
                    query: {
                      product_finaly: product.product_finaly_id,
                    },
                  }}
                  title="Ver historial"
                >
                  <EyeIcon className="w-4 h-4" />
                </Link>
                <ButtonDangerSm
                  onClick={(e) => deleteHistory(product.product_finaly_id)}
                  icon={<TrashIcon className="w-4 h-4" />}
                  title="Eliminar producto del almacen"
                />
              </div>
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}
