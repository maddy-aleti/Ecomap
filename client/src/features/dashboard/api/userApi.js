import api from "../../../shared/api/client";

export const getProfile = () =>
  api.get("/users/profile");
