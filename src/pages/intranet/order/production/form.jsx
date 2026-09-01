import BanerModule from "@/components/BanerModule";
import LoyoutIntranet from "@/components/LoyoutIntranet";
import FormProductionOrder from "@/components/orders/production/form/FormProductionOrder";
import FormProduct from "@/components/products/FormProduct";
import { verifUser } from "@/helpers/verifUser";
import { useFormProduct } from "@/hooks/products/useProduct";
import React, { useState } from "react";

export async function getServerSideProps(context) {
  return await verifUser(context, "/order/production/form");
}
export default function FormOrderProduction({
  dataUser,
  dataModules,
  dataRoles,
}) {
  const {
    categories,
    labels,
    product,
    modal,
    handleCloseModal,
    saveProduct,
    getProduct,
  } = useFormProduct();
  const [productSavedId, setProductSavedId] = useState(null);

  const handleSaveProduct = async (...args) => {
    const result = await saveProduct(...args);
    if (result) {
      setProductSavedId(result?.id);
    }
    return result;
  };
  return (
    <LoyoutIntranet
      title="Formulario orden de producción"
      description=""
      user={dataUser}
      modules={dataModules}
      roles={dataRoles}
    >
      <BanerModule
        imageBanner="/baners/Group 17.jpg"
        title="Formulario Orden de producción"
      />
      <FormProductionOrder
        getProduct={getProduct}
        productSavedId={productSavedId}
        setProductSavedId={setProductSavedId}
      />
      <FormProduct
        categories={categories}
        listLabels={labels}
        productEdit={product}
        statusModal={modal}
        closeModal={handleCloseModal}
        handleSave={handleSaveProduct}
        editStock={product?.editStock}
        subcategoriesData={product?.subcategories}
      />
    </LoyoutIntranet>
  );
}
