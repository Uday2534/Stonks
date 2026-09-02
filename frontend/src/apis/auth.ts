import api from './axios';

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
};

export const login = async (
  data: LoginData
) => {
  const response = await api.post(
    '/auth/login',
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterData
) => {
  const response = await api.post(
    '/auth/register',
    data
  );

  return response.data;
};