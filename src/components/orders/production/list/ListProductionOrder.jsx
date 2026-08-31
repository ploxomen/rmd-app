import { InputSearch } from "@/components/Inputs";
import PaginationTable from "@/components/PaginationTable";
import { SelectPrimary } from "@/components/Selects";
import { useApi } from "@/hooks/useApi";
import { useDataList } from "@/hooks/useDataList";
import TableProductOrders from "./TableProductOrders";

export default function ListProductionOrder() {
    const { data: customers } = useApi("/quotation-extra/customers");
  const {
      filters,
      dataTotal,
      data,
      serchInfomation,
      changeFilter,
    } = useDataList({
      url: "/order/production/all",
      params: { customer: "" },
    });
  return (
    <div className="w-full p-6 bg-white rounded-md shadow">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
        <div style={{ width: "350px" }}>
          <SelectPrimary
            name="customer"
            label="Clientes"
            inputRequired="required"
            value={filters.customer}
            onChange={(e) => changeFilter("customer", e.target.value)}
          >
            <option value="">TODOS</option>
            {
              customers?.data?.map((customer) => (
                <option key={customer.value} value={customer.value}>
                  {customer.label}
                </option>
              ))
            }
          </SelectPrimary>
        </div>
        <div style={{ width: "300px" }}>
          <InputSearch
            placeholder="¿Que estas buscando?"
            onInput={serchInfomation}
          />
        </div>
      </div>
      <div className="overflow-x-auto mb-2">
        <TableProductOrders
          productOrders={data}
          // addHistory={handleAddHistory}
          // deleteHistory={handleDeleteAllHistory}
        />
      </div>
      <PaginationTable
        currentPage={filters.page}
        quantityRow={filters.show}
        totalData={dataTotal}
        handleChangePage={(number) => changeFilter("page", number)}
      />
    </div>
  );
}
