import React from "react";
import { verifUser } from "@/helpers/verifUser";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import BanerModule from "@/components/BanerModule";
import { useDataList } from "@/hooks/useDataList";
import PaginationTable from "@/components/PaginationTable";
import { InputPrimary } from "@/components/Inputs";
import TableChangeMoney from "@/components/money/TableChangeMoney";
import { useChangeMoney } from "@/hooks/billing/useChangeMoney";
import FormModalChangeMoney from "@/components/money/FormModalChangeMoney";
import { ButtonPrimary } from "@/components/Buttons";
import { PlusIcon } from "@heroicons/react/24/solid";
export async function getServerSideProps(context) {
  return await verifUser(context, "/money/change");
}

export default function ChangeMoney({ dataModules, dataUser, dataRoles }) {
  const {
    dataTotal,
    data: listMoney,
    handleChangeFilter,
    filters,
    changeFilter,
    reloadPage,
  } = useDataList({
    url: "/money/change",
  });
  const {
    deleteChangeMoney,
    getChangeMoney,
    form,
    modal,
    handleChangeValueForm,
    saveChangeMoney,
    handleCloseModalChangeMoney,
    handleOpenModalChangeMoney,
  } = useChangeMoney(reloadPage);
  return (
    <>
      <LoyoutIntranet
        title="Categorias"
        description="Administración de categorías"
        user={dataUser}
        modules={dataModules}
        roles={dataRoles}
      >
        <BanerModule
          imageBanner="/baners/Group 10.jpg"
          title="Administración de tipos de cambio"
        />
        <div className="w-full p-6 bg-white rounded-md shadow overflow-x-auto">
          <div className="flex gap-2 flex-wrap">
            <div className="max-w-48">
              <InputPrimary
                type="date"
                value={filters.date_initial}
                name="date_initial"
                label="Fecha inicio"
                onChange={handleChangeFilter}
              />
            </div>
            <div className="max-w-48">
              <InputPrimary
                type="date"
                value={filters.date_finaly}
                name="date_finaly"
                label="Fecha final"
                onChange={handleChangeFilter}
              />
            </div>
            <div className="max-w-48">
              <ButtonPrimary
                type="button"
                icon={<PlusIcon className="size-4" />}
                text="Agregar"
                onClick={(e) => handleOpenModalChangeMoney()}
              />
            </div>
          </div>
          <TableChangeMoney
            data={listMoney}
            deleteChangeMoney={deleteChangeMoney}
            getChangeMoney={getChangeMoney}
          />
          <PaginationTable
            currentPage={filters.page}
            quantityRow={filters.show}
            totalData={dataTotal}
            handleChangePage={(number) => changeFilter("page", number)}
          />
        </div>
      </LoyoutIntranet>
      <FormModalChangeMoney
        form={form}
        handleCloseModal={handleCloseModalChangeMoney}
        handleSubmit={saveChangeMoney}
        handleChangeValueForm={handleChangeValueForm}
        status={modal}
      />
    </>
  );
}
