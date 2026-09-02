import api from './axios';

export const getLatestSnapshot =
  async () => {
    const response =
      await api.get(
        '/snapshot/latest'
      );

    return response.data;
  };

export const getSnapshotHistory =
  async (
    days = 30
  ) => {
    const response =
      await api.get(
        `/snapshot/history?days=${days}`
      );

    return response.data;
  };