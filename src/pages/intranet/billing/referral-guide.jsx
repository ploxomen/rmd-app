import BanerModule from "@/components/BanerModule";
import FormReferralGuide from "@/components/billing/FormReferralGuide";
import TableReferralGuide from "@/components/billing/TableReferralGuide";
import { InputSearch } from "@/components/Inputs";
import Label from "@/components/Label";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import PaginationTable from "@/components/PaginationTable";
import Select from "react-select";
import { verifUser } from "@/helpers/verifUser";
import { useGuideReferral } from "@/hooks/billing/useGuideReferral";
import { useDataList } from "@/hooks/useDataList";
import { ButtonPrimary } from "@/components/Buttons";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
export async function getServerSideProps(context) {
  return await verifUser(context, "/billing/referral-guide");
}
export default function ReferralGuide({ dataUser, dataModules, dataRoles }) {
  const { filters, dataTotal, data, serchInfomation, changeFilter, reloadPage} =
    useDataList({
      url: "/billing/guide-referral",
      params: { customer: "" },
    });
  const {
    deleteGuide,
    getGuide,
    customers,
    formData,
    modal,
    closeModal,
    products,
    details,
    handleAddDetail,
    handleDeleteDetail,
    handleChangeMaterial,
    responseRequest
  } = useGuideReferral(reloadPage);
  return (
    <>
      <LoyoutIntranet
        title="Guías de remisión"
        description="Listar, crear y editar guías de remisión"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 17.jpg"
          title="Guías de remisión"
        />
        <div className="w-full p-6 bg-white rounded-md shadow mb-4 grid grid-cols-12 gap-x-3 gap-y-0">
          <div className="col-span-full md:col-span-6 lg:col-span-3">
            <Label text="Clientes" htmlFor="customer" required />
            <Select
              instanceId="customer"
              name="customer"
              options={[{ value: "", label: "TODOS" }, ...customers]}
              onChange={(e) => changeFilter("customer", e.value)}
              menuPosition="fixed"
              value={
                filters.customer === ""
                  ? [{ value: "", label: "TODOS" }]
                  : customers.filter((prov) => prov.value === filters.customer)
              }
            />
          </div>
          <div className="col-span-full md:col-span-6 lg:col-span-3">
            <ButtonPrimary
              text="Agregar"
              icon={<PlusCircleIcon className="size-4" />}
              onClick={(e) => getGuide(null)}
            />
          </div>
        </div>
        <div className="w-full p-6 bg-white rounded-md shadow">
          <div style={{ width: "300px" }} className="mb-4 ml-auto">
            <InputSearch
              placeholder="¿Que estas buscando?"
              onInput={serchInfomation}
            />
          </div>
          <div className="overflow-x-auto overflow-y-hidden mb-4">
            <TableReferralGuide
              guides={data}
              deleteGuide={deleteGuide}
              getGuide={getGuide}
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
      <FormReferralGuide
        formData={formData}
        products={products}
        detailsProducts={details}
        handleAddDetail={handleAddDetail}
        handleDeleteDetail={handleDeleteDetail}
        handleChangeMaterial={handleChangeMaterial}
        callbackResponse={responseRequest}
        viewModal={modal}
        listCustomers={customers}
        handleClose={closeModal}
      />
    </>
  );
}
