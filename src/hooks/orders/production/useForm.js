import apiAxios from "@/axios";
import { sweetAlert } from "@/helpers/getAlert";
import { useApi } from "@/hooks/useApi";
import { useFormData } from "@/hooks/useFormData";
import { useCallback, useEffect, useState } from "react";
import { getCookie } from "@/helpers/getCookie";
import { notFound } from "next/navigation";

const INITIAL_FORM = {
  id: null,
  date_issue: "",
  cod_client: "",
  name_client: "",
  date_delivery: "",
  observations: "",
  address: "",
};
export const useFormOrderProduct = (id) => {
  const { data: shortages } = useApi("/order/production/shortages");
  const callbackSubmitResponse = async (data, alertResponse) => {
    if (alertResponse.isConfirmed) {
      window.location.reload();
    }
  };
  const {
    form,
    setFormManual,
    setFormulario,
    handleSubmitParam,
    setFormObject,
  } = useFormData({
    data: INITIAL_FORM,
    method: id ? "put" : "post",
    url: id ? `/order/production/update/${id}` : "/order/production/generate",
    callbackResponse: callbackSubmitResponse,
  });
  const { data: labels } = useApi("/product-labels");
  const [products, setProducts] = useState([]);
  const [orderIdSelect, setOrderIdSelect] = useState(null);
  const [ordersSelected, setOrdersSelected] = useState([]);
  const [productNotProduction, setProductNotProduction] = useState([]);
  const [errorSelectedOrder, setErrorSelectedOrder] = useState("");
  const headers = getCookie();
  const joinDetailsOrders = (detailsOrder) => {
    const detailString = `${detailsOrder.order_code}: ${detailsOrder.order_details || "Sin observaciones"}`;
    setFormManual(
      "observations",
      form.details_order
        ? form.details_order + "\n" + detailString
        : detailString,
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitParam({
      ...form,
      details: JSON.stringify(products),
    });
  };
  const removeProductNotProduction = (productId) => {
    setProductNotProduction(
      productNotProduction.filter(
        (product) => product.product_id !== Number(productId),
      ),
    );
  };
  const handleSelectOrder = async (orderId) => {
    setErrorSelectedOrder("");
    setOrderIdSelect(null);
    setProductNotProduction([]);
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
    const response = await getDetailProductOrder(orderId);
    if (!response) {
      return false;
    }
    setFormManual("name_client", order.customer_name);
    setFormManual("cod_client", order.customer_id);
    setOrdersSelected((prev) => [...prev, order]);
  };
  const handleDeleteOrder = (orderId) => {
    setErrorSelectedOrder("");
    setProductNotProduction([]);
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
      if (response.data.alert) {
        setOrderIdSelect(orderId);
        setErrorSelectedOrder(response.data.alert);
        setProductNotProduction(response.data.data);
        return false;
      }
      setProducts(response.data.data);
      joinDetailsOrders(response.data.details);
      return true;
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: "Error",
        text: "Error al obtener los productos de producción",
        icon: "error",
      });
      return false;
    }
  };
  useEffect(() => {
    const getData = async () => {
      if (!id) {
        return false;
      }
      const response = await apiAxios.get("/order/production/show/" + id);
      if (!response.data?.data) {
        notFound();
      }
      const data = response.data.data;
      const products = response.data.products;
      const objResponse = {
        id: data.id,
        date_issue: data.order_produc_date_issue,
        cod_client: data.order_production_customer,
        name_client: data.customer.customer_name,
        date_delivery: data.order_produc_date_delive,
        observations: data.order_production_detail,
        address: data.order_produc_address,
      };
      setFormObject(objResponse);
      setProducts(products);
      const ordersUnique = Array.from(
        new Map(products.map((item) => [item.order_code, item])).values(),
      ).map((item) => ({
        id: item.order_id,
        order_code: item.order_code,
        order_date_issue: null,
        customer_name: data.customer.customer_name,
        customer_id: data.customer.id,
      }));
      setOrdersSelected(ordersUnique);
    };
    getData();
  }, []);
  useEffect(() => {
    if (!productNotProduction.length && orderIdSelect) {
      handleSelectOrder(orderIdSelect);
    }
  }, [productNotProduction]);
  return {
    form,
    shortages,
    ordersSelected,
    handleSelectOrder,
    handleSubmit,
    errorSelectedOrder,
    handleChangeAmountProduct,
    handleDeleteOrder,
    handleSubmitParam,
    orderIdSelect,
    labels,
    productNotProduction,
    setFormulario,
    products,
    removeProductNotProduction,
  };
};
