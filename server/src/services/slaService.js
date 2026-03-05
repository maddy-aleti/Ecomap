import axios from "axios";

const SLA_BASE_URL = "http://127.0.0.1:8000";

export const generateRTA = async (payload) => {
  try {
    const response = await axios.post(
      `${SLA_BASE_URL}/api/escalation/generate-rta`,
      payload,
      {
        timeout: 30000 // Gemini can be slow
      }
    );

    return response.data;
  } catch (error) {
    console.error("SLA Service Error:", error.response?.data || error.message);
    throw new Error("Failed to generate RTA");
  }
};
