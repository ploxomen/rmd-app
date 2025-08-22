import BanerModule from "@/components/BanerModule";
import { ButtonDanger, ButtonPrimary } from "@/components/Buttons";
import { InputSearch } from "@/components/Inputs";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import FormShopping from "@/components/stores/FormShopping";
import TableShopping from "@/components/stores/TableShopping";
import { verifUser } from "@/helpers/verifUser";
import { useShopping } from "@/hooks/shopping/useShopping";
import { useDataList } from "@/hooks/useDataList";
import {
  DocumentArrowDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
export async function getServerSideProps(context) {
  return await verifUser(context, "/store/shopping/general");
}
export default function general({ dataUser, dataModules, dataRoles }) {
  const { data, dataTotal, serchInfomation, filters, changeFilter, reloadPage } =
    useDataList({
      url: "store-shopping",
    });
  const {
    form,
    modal,
    products,
    providers,
    handleAddShopping,
    handleDeleteDetail,
    handleAddDetail,
    handleCloseModal,
    responseRequest,
    details,
    handleChangeValueDetail,
    handleDeleteBuy,
    handleViewBuy
  } = useShopping(reloadPage);
  return (
    <>
      <LoyoutIntranet
        title="Administracion de compras"
        description="Administracion de compras"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 14.jpg"
          title="Administración de compras"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="flex w-full items-center justify-between gap-2 flex-wrap mb-2">
            <div>
              <ButtonDanger
                text="Agregar"
                icon={<PlusCircleIcon className="size-5" />}
                onClick={(e) => handleAddShopping()}
              />
              <ButtonPrimary
                text="Exportar"
                icon={<DocumentArrowDownIcon className="size-5" />}
                onClick={(e) => {}}
              />
            </div>
            <div style={{ width: "300px" }}>
              <InputSearch
                placeholder="¿Que estas buscando?"
                onInput={serchInfomation}
              />
            </div>
          </div>
          <div className="overflow-x-auto mb-4">
            <TableShopping shopping={data} handleDeleteBuy={handleDeleteBuy} handleViewBuy={handleViewBuy}/>
          </div>
          <PaginationTable
            currentPage={filters.page}
            quantityRow={filters.show}
            totalData={dataTotal}
            handleChangePage={(number) => changeFilter("page", number)}
          />
        </div>
      </LoyoutIntranet>
      <FormShopping
        data={form}
        modal={modal}
        providers={providers}
        handleChangeValueDetail={handleChangeValueDetail}
        products={products}
        responseRequest={responseRequest}
        details={details}
        handleCloseModal={handleCloseModal}
        handleAddDetail={handleAddDetail}
        handleDeleteDetail={handleDeleteDetail}
      />
    </>
  );
}
