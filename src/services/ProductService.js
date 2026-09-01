import apiAxios from '@/axios';

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

};