import api from "../../../shared/api/client";

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userName", res.data.user.name);
  }
  return res.data;
};

export const verifyEmail = (token) =>
  api.get(`/auth/verify-email/${token}`);

export const resendVerificationEmail = (email) =>
  api.post("/auth/resend-verification", { email });

export const initiateGoogleAuth = () => {
  window.location.href = `${api.defaults.baseURL}/auth/google`;
};
