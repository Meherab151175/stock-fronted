import axios from "axios";

const API_URL = "https://stock-backend-07c7.onrender.com";

export const stockApi = {
  getStocks: async (skip = 0, limit = 10, tradeCode?: string) => {
    const { data } = await axios.get(`${API_URL}/stocks`, {
      params: { skip, limit, trade_code: tradeCode },
    });
    return data;
  },

  getTradeCodes: async () => {
    const { data } = await axios.get(`${API_URL}/stocks/trade-codes`);
    return data;
  },

  getStockById: async (id: number) => {
    const { data } = await axios.get(`${API_URL}/stocks/${id}`);
    return data;
  },

  createStock: async (stock) => {
    const { data } = await axios.post(`${API_URL}/stocks`, stock);
    return data;
  },

  updateStock: async (id: number, stock) => {
    const { data } = await axios.put(`${API_URL}/stocks/${id}`, stock);
    return data;
  },

  deleteStock: async (id: number) => {
    const { data } = await axios.delete(`${API_URL}/stocks/${id}`);
    return data;
  },
};
