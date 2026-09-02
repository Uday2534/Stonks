import api from './axios';

export const getHoldings = async () => {
  const response = await api.get(
    '/broker/zerodha/holdings'
  );

  return response.data;
};