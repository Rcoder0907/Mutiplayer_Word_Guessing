import { isLoggedIn } from "./authHelper";

export const guestGuard = (to, from, next) => {
  if (isLoggedIn()) {
    return next("/dashboard");
  }
  return next();
};

export const authGuard = (to, from, next) => {
  if (!isLoggedIn()) {
    return next("/");
  }
  return next();
};
