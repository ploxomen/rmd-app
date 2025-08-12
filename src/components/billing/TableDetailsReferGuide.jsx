import { optionsUnitsMeasurements } from '@/helpers/listUnitsMeasurements';
import React from 'react'
import TableIntranet from '../TableIntranet';
import SelectSimple from '../SelectSimple';
import { InputDetailsSm } from '../Inputs';
import { ButtonDangerSm } from '../Buttons';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function TableDetailsReferGuide({
    details = [],
    handleDelete = () => {},
    handleChangeMaterial = () => {},
    products = [],
}) {
    const newDetails = details.map((detail) => {
        return {
          ...detail,
          detail_units_measurement: products.find(
            (p) => p.tipo == detail.detail_store && p.product_id == detail.detail_product_id
          )?.product_unit_measurement,
        };
      });
      return (
        <TableIntranet
          columns={["Almacen de origen", "producto", "cantidad", "unidad", "acciones"]}
        >
          {!newDetails.length ? (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan="100%" className="text-center font-bold">
                No se registraron productos para esta guía de remisión
              </td>
            </tr>
          ) : (
            newDetails.map(detail => (
              <tr className="bg-white dark:bg-gray-800 text-xs" key={detail.detail_id}>
                <td className="p-1 text-center min-w-40">
                  <SelectSimple
                    name={`material-${detail.detail_id}`}
                    isRequired
                    onChange={(e) =>
                      handleChangeMaterial("detail_store", e.target.value, detail.detail_id)
                    }
                    value={detail.detail_store}
                  >
                    <option value="MATERIA PRIMA">MATERIA PRIMA</option>
                    <option value="PRODUCTO TERMINADO">PRODUCTO TERMINADO</option>
                    <option value="PRODUCTO MERCADERIA">PRODUCTO MERCADERIA</option>
                  </SelectSimple>
                </td>
                <td className="p-1 text-center min-w-64">
                  <SelectSimple
                    name={`products-${detail.detail_id}`}
                    value={detail.detail_product_id}
                    isRequired
                    onChange={(e) =>
                      handleChangeMaterial("detail_product_id", e.target.value, detail.detail_id)
                    }
                  >
                    <option value="" disabled hidden>
                      Ninguno
                    </option>
                    {products
                      .filter((p) => p.tipo === detail.detail_store)
                      .map((product) => (
                        <option
                          key={`product-${detail.detail_id}-list-${product.product_id}`}
                          value={product.product_id}
                        >
                          {product.product_name}
                        </option>
                      ))}
                  </SelectSimple>
                </td>
                <td className="p-1 text-center w-[4px]">
                  <InputDetailsSm
                    type="number"
                    required
                    name={`stock-${detail.detail_id}`}
                    onChange={(e) =>
                      handleChangeMaterial("detail_stock", e.target.value, detail.detail_id)
                    }
                    step="0.01"
                    value={detail.detail_stock}
                  />
                </td>
                <td className="p-1 text-center">
                  {
                    optionsUnitsMeasurements.find(
                      (unit) => unit.value === detail.detail_units_measurement
                    )?.label
                  }
                </td>
                <td className="p-1 text-center">
                  <ButtonDangerSm
                    onClick={(e) => handleDelete(detail.detail_id)}
                    icon={<TrashIcon className="size-3" />}
                  />
                </td>
              </tr>
            ))
          )}
        </TableIntranet>
      );
}
