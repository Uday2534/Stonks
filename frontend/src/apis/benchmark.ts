import api from './axios';

export const getBenchmarkHistory = async (
  benchmark = 'NIFTY50',
  days = 30
) => {
  const response =
    await api.get(
      `/benchmark/history/${benchmark}?days=${days}`
    );

  return response.data;
};