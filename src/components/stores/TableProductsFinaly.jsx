import React from "react";
import TableIntranet from "../TableIntranet";
import { optionsUnitsMeasurements } from "@/helpers/listUnitsMeasurements";
import { parseMoney } from "@/helpers/utilities";
import { sweetAlert } from "@/helpers/getAlert";
import { ButtonDangerSm, ButtonPrimarySm } from "../Buttons";
import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function TableProductsFinaly({
  products = [],
  money = 0,
  addHistoryImport = () => {},
  addHistoryAssembled = () => {},
  deleteHistory = () => {},
}) {
  const columns = [
    "Código",
    "Producto",
    "Tipo",
    "Cantidad",
    "Unidad",
    "Precio Venta",
    "Acciones",
  ];
  const customProducts = products.map((item) => ({
    ...item,
    addHistory: () =>
      item.product_label_2 == "ENSAMBLADO"
        ? addHistoryAssembled({
          product_name: item.product_name,
          product_id: item.id,
          product_price_client: item.product_public_customer
        })
        : addHistoryImport({
            product_name: item.product_name,
            product_finaly_unit_measurement: item.product_unit_measurement,
            product_finaly_type_change: money,
            product_id: item.id
          }),
  }));

  return (
    <TableIntranet columns={columns}>
      {!customProducts.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron productos
          </td>
        </tr>
      ) : (
        customProducts.map((product) => (
          <tr className="bg-white dark:bg-gray-800 text-xs" key={product.id}>
            <td className="p-1 text-center">
              {product.product_code.toString().padStart(3, "0")}
            </td>
            <td className="p-1 text-center">{product.product_name}</td>
            <td className="p-1 text-center">{product.product_label_2}</td>
            <td className="p-1 text-center">{product.product_finaly_stock}</td>
            <td className="p-1 text-center">
              {
                optionsUnitsMeasurements.find(
                  (unit) => unit.value === product.product_unit_measurement
                )?.label
              }
            </td>
            <td className="p-1">
              {parseMoney(product.product_public_customer, "PEN")}
            </td>
            <td className="p-1">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  onClick={(e) =>
                    money == 0
                      ? sweetAlert({
                          title: "Alerta",
                          text: "No se estableció el tipo de cambio",
                          icon: "warning",
                        })
                      : product.addHistory()
                  }
                  icon={<PlusIcon className="w-4 h-4" />}
                  title="Agregar historial"
                />
                <Link
                  className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white"
                  href={{
                    pathname: `/intranet/store/products-finaly/histories`,
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
