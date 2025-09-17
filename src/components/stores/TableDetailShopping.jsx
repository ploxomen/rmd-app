import React from "react";
import TableIntranet from "../TableIntranet";
import SelectSimple from "../SelectSimple";
import Select from "react-select";
import { InputDetailsSm } from "../Inputs";
import { ButtonDangerSm } from "../Buttons";
import { TrashIcon } from "@heroicons/react/24/solid";
import { parseMoney } from "@/helpers/utilities";

export default function TableDetailShopping({
  products = [],
  details = [],
  money = "",
  handleDeleteDetail = () => {},
  handleChangeValueDetail = () => {},
}) {
  const columns = [
    "almacen destino",
    "producto",
    "cantidad",
    "p. unitario",
    "total",
    "acciones",
  ];
  return (
    <TableIntranet columns={columns}>
      {!details.length ? (
        <tr className="bg-white dark:bg-gray-800">
          <td colSpan="100%" className="text-center font-bold">
            No se registraron detalles
          </td>
        </tr>
      ) : (
        details.map((detail) => (
          <tr
            className="bg-white dark:bg-gray-800 text-xs"
            key={detail.detail_id}
          >
            <td className="p-1 text-center min-w-40">
              <SelectSimple
                name={`material-${detail.detail_id}`}
                isRequired
                onChange={(e) =>
                  handleChangeValueDetail(
                    "detail_store",
                    e.target.value,
                    detail.detail_id
                  )
                }
                value={detail.detail_store}
              >
                <option value="MATERIA PRIMA">MATERIA PRIMA</option>
                <option value="MERCADERIA">PRODUCTO MERCADERIA</option>
              </SelectSimple>
            </td>
            <td className="p-1 text-center min-w-64">
              <Select
                instanceId="provider_list"
                placeholder="Seleccione un producto"
                name={`products-${detail.detail_id}`}
                options={products
                  .filter((p) => p.tipo === detail.detail_store)
                  .map((product) => ({
                    label: product.product_name,
                    value: product.product_id,
                  }))}
                onChange={(e) => {
                  handleChangeValueDetail(
                    "detail_product_id",
                    e.value,
                    detail.detail_id
                  );
                }}
                menuPosition="fixed"
                value={products
                  .filter(
                    (product) => product.product_id == detail.detail_product_id
                  )
                  .map((product) => ({
                    label: product.product_name,
                    value: product.product_id,
                  }))}
              />
            </td>
            <td className="p-1 text-center w-2">
              <InputDetailsSm
                type="number"
                required
                name={`stock-${detail.detail_id}`}
                onChange={(e) =>
                  handleChangeValueDetail(
                    "detail_stock",
                    e.target.value,
                    detail.detail_id
                  )
                }
                step="0.01"
                value={detail.detail_stock}
              />
            </td>
            <td className="p-1 text-center w-4">
              <InputDetailsSm
                type="number"
                required
                name={`price-unit-${detail.detail_id}`}
                onChange={(e) =>
                  handleChangeValueDetail(
                    "datail_price_unit",
                    e.target.value,
                    detail.detail_id
                  )
                }
                step="0.01"
                value={detail.datail_price_unit}
              />
            </td>
            <td className="p-1">
              {parseMoney(
                detail.datail_price_unit * detail.detail_stock,
                money
              )}
            </td>
            <td className="p-1 text-center">
              <ButtonDangerSm
                onClick={(e) => handleDeleteDetail(detail.detail_id)}
                icon={<TrashIcon className="size-3" />}
              />
            </td>
          </tr>
        ))
      )}
    </TableIntranet>
  );
}
