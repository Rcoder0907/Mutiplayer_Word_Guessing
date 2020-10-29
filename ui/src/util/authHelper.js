const AUTH_TOKEN_NAME = "authToken";

export const isLoggedIn = () => {
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  return !!token;
};

export const deleteToken = () => {
  localStorage.removeItem(AUTH_TOKEN_NAME);
};

export const setToken = token => {
  localStorage.setItem(AUTH_TOKEN_NAME, token);
};

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_NAME);
};
