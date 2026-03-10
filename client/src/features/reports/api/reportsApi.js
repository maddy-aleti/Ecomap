import api from "../../../shared/api/client";

export const createReport = (formData) =>
  api.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getReports = () =>
  api.get("/reports");
