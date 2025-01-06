import React from "react";
import TableIntranet from "../TableIntranet";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from "../Buttons";
import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

function TableRawMaterial({ products, addHistory, deleteHistory }) {
  const columns = [
    "Código",
    "Producto",
    "Sub almacen",
    "Stock",
    "Costo Compra",
    "Acciones",
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
          <tr className="bg-white dark:bg-gray-800" key={product.id}>
            <td className="py-2 px-4 text-center">
              {product.id.toString().padStart(3, "0")}
            </td>
            <td className="py-2 px-4">{product.product_name}</td>
            <td className="py-2 px-4">{product.store_sub_name}</td>
            <td className="py-2 px-4">{product.raw_material_stock}</td>
            <td className="py-2 px-4">
              {parseMoney(product.raw_material_price_buy, product.raw_material_money)}
            </td>
            <td className="py-2 px-4">
              <div className="flex gap-1 flex-wrap justify-center">
                <ButtonPrimarySm
                  text="Agregar"
                  onClick={(e) => addHistory(product.product_id)}
                  icon={<PlusIcon className="w-4 h-4" />}
                />
                <Link
                  className="rounded-md relative overflow-hidden inline-flex group items-center justify-center px-2 py-1.5 cursor-pointer border-b-4 border-l-2 hover:bg-blue-600 font-semibold transition-all ease-in-out text-xs shadow-lg bg-gradient-to-tr bg-blue-500 text-white"
                  href={{
                    pathname: `/intranet/raw-material-history`,
                    query: {
                      raw_material: product.id
                    }
                  }}
                >
                  <div className="flex justify-center items-center gap-0.5">
                    <EyeIcon className="w-4 h-4" />
                    <span className="relative">Historial</span>
                  </div>
                </Link>
                <ButtonDangerSm
                  text="Eliminar"
                  onClick={(e) => deleteHistory(product.id)}
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

export default TableRawMaterial;
