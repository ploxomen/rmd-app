import apiAxios from "@/axios";
import { sweetAlert } from "@/helpers/getAlert";
import { useApi } from "@/hooks/useApi";
import { useFormData } from "@/hooks/useFormData";
import { useState } from "react";
import { getCookie } from "@/helpers/getCookie";

const INITIAL_FORM = {
  id: null,
  date_issue: "",
  name_client: "",
  date_delivery: "",
  address: "",
};
export const useFormOrderProduct = () => {
  const { form, setFormManual } = useFormData({
    data: INITIAL_FORM,
    url: "/order/production",
  });
  const { data: shortages } = useApi("/order/production/shortages");
  const { data: labels } = useApi("/product-labels");
  const [products, setProducts] = useState([]);
  const [ordersSelected, setOrdersSelected] = useState([]);
  const [errorSelectedOrder, setErrorSelectedOrder] = useState("");
  const headers = getCookie();

  const handleSelectOrder = (event) => {
    const orderId = event.target.value;
    setErrorSelectedOrder("");
    if (!orderId) {
      return;
    }
    const order = shortages?.data.find((order) => order.id === Number(orderId));
    const diferentClient = ordersSelected.some(
      (sel) => sel.customer_id !== order.customer_id,
    );
    if (diferentClient) {
      return setErrorSelectedOrder(
        "No se puede generar una orden de produccion de diferentes clientes",
      );
    }
    setFormManual("name_client", order.customer_name);
    getDetailProductOrder(orderId);
    setOrdersSelected((prev) => [...prev, order]);
  };
  const handleDeleteOrder = (orderId) => {
    setErrorSelectedOrder("");
    if (!orderId) {
      return;
    }
    setOrdersSelected(ordersSelected.filter((prev) => prev.id !== orderId));
    setProducts(products.filter((prev) => prev.order_id !== orderId));
  };
  const handleChangeAmountProduct = (quotationId, productId, value) => {
    setProducts(
      products.map((prev) =>
        prev.quota_deta_id === Number(quotationId) &&
        prev.product_id === Number(productId)
          ? { ...prev, amount: value || 0 }
          : prev,
      ),
    );
  };
  const getDetailProductOrder = async (orderId) => {
    try {
      const response = await apiAxios.get(
        `/order/production/product/${orderId}`,
        { headers },
      );
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
      return sweetAlert({
        title: "Error",
        text: "Error al eliminar la cotización",
        icon: "error",
      });
    }
  };
  return {
    form,
    shortages,
    ordersSelected,
    handleSelectOrder,
    errorSelectedOrder,
    handleChangeAmountProduct,
    handleDeleteOrder,
    labels,
    products,
  };
};
