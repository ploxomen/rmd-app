import React from "react";
import TableIntranet from "../TableIntranet";
import { parseMoney } from "@/helpers/utilities";
import { ButtonDangerSm, ButtonPrimarySm, ButtonSecondarySm } from "../Buttons";
import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

function TableRawMaterial({ products, addHistory, viewHistory, deleteHistory }) {
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
                <ButtonSecondarySm
                  text="Historial"
                  onClick={(e) => viewHistory(product.id)}
                  icon={<EyeIcon className="w-4 h-4" />}
                />
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
