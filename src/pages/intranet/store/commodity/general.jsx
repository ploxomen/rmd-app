import BanerModule from "@/components/BanerModule";
import TableGeneral from "@/components/commodity/TableGeneral";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import { SelectPrimary } from "@/components/Selects";
import FormCommodity from "@/components/stores/FormCommodity";
import FormMoney from "@/components/stores/FormMoney";
import { listStores } from "@/helpers/listStores";
import { verifUser } from "@/helpers/verifUser";
import { useCommodity } from "@/hooks/commodity/useCommodity";
import { useApi } from "@/hooks/useApi";
import { useDataList } from "@/hooks/useDataList";
import { useMoney } from "@/hooks/useMoney";
export async function getServerSideProps(context) {
  return await verifUser(context, "/store/commodity/general");
}
export default function CommodityHome({ dataModules, dataUser, dataRoles }) {
  const {
    filters,
    dataTotal,
    data,
    serchInfomation,
    changeFilter,
    reloadPage,
  } = useDataList({
    url: "/store-commodity",
    params: { etiqueta2: "" },
  });
  const {
    modal: modalMoney,
    setMoneyChange,
    moneyChange,
    handleCloseModal: closeModalMoney,
  } = useMoney();
  const { data: providers } = useApi("raw-material/providers/list");
  const {
    data: form,
    handleDeleteAllHistory,
    handleAddHistory,
    callbackResponse,
    modal,
    handleCloseModal: modalCloseCommodity,
  } = useCommodity(reloadPage);

  return (
    <>
      <LoyoutIntranet
        title="Almacen de mercadería"
        description="Lista de los productos de mercaderia"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 17.jpg"
          title="Almacen de mercadería"
        />
        <div className="w-full p-6 bg-white rounded-md shadow">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
            <div style={{ width: "350px" }}>
              <SelectPrimary
                name="tipo"
                label="Tipo"
                inputRequired="required"
                value={filters.tipo}
                onChange={(e) => changeFilter("tipo", e.target.value)}
              >
                <option value="">TODOS</option>
                {listStores
                  .find((store) => store.label === "ALMACEN MERCADERIA")
                  .options_2.map((store) => (
                    <option value={store.value} key={store.value}>
                      {store.label}
                    </option>
                  ))}
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
            <TableGeneral
              products={data}
              addHistory={handleAddHistory}
              deleteHistory={handleDeleteAllHistory}
            />
          </div>
          <PaginationTable
            currentPage={filters.page}
            quantityRow={filters.show}
            totalData={dataTotal}
            handleChangePage={(number) => changeFilter("page", number)}
          />
        </div>
      </LoyoutIntranet>
      <FormCommodity
        handleCloseModal={modalCloseCommodity}
        callbackResponse={callbackResponse}
        modal={modal}
        data={form}
        listProviders={providers.providers}
        moneyChange={moneyChange}
      />
      <FormMoney
        status={modalMoney}
        valueMoney={moneyChange}
        changeMoney={setMoneyChange}
        closeModal={closeModalMoney}
      />
    </>
  );
}
