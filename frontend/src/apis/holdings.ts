import api from './axios';

export const getHoldings = async () => {
  try {
    const response = await api.get(
      '/broker/zerodha/holdings'
    );

    return response.data;
  } catch (error: any) {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code ===
        'ZERODHA_SESSION_EXPIRED'
    ) {
      throw new Error('ZERODHA_SESSION_EXPIRED');
    }

    throw error;
  }
};