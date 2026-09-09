import api from './axios';

export const getProfile = async () => {
  const response = await api.get(
    '/broker/zerodha/profile'
  );

  return response.data;
};

export const getLoginUrl = async () => {
  const response = await api.get(
    '/broker/zerodha/login'
  );

  return response.data;
};
export const getBrokerStatus = async () => {
    const response = await api.get(
      '/broker/zerodha/status'
    );

    return response.data;
  };