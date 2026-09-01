import apiAxios from '@/axios';
import { getCookie } from "@/helpers/getCookie";
const headers = getCookie();
export const ProductService = {
  async getCategories() {
    const res = await apiAxios.get('/product-categorie');
    return res.data.data;
  },
  async getLabels() {
    const res = await apiAxios.get('/product-labels');
    return res.data.data;
  },
  async getProduct(id) {
    const res = await apiAxios.get(`/product/${id}`);
    return res.data;
  },
  async saveProduct(data) {
    const headerApi = {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers
      },
    };
    const res = !data.has('id')
      ? await apiAxios.post('/product', data, headerApi)
      : await apiAxios.post('/product/' + data.get('id'), data, headerApi);
    return res.data;
  }
};