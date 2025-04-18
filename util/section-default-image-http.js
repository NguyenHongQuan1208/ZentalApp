import axios from "axios";

const BACKEND_URL = "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

export const fetchDefaultImageUriBySectionId = async (sectionId) => {
  try {
    const url = `${BACKEND_URL}/taskSections/${sectionId}.json`;
    const response = await axios.get(url);
    return response.data.defaultImageUri;
  } catch (error) {
    console.error("Error fetching defaultImageUri:", error);
    throw error;
  }
};

export const getColorAndTitle = async (sectionId) => {
  try {
    const url = `${BACKEND_URL}/taskSections/${sectionId}.json`;
    const response = await axios.get(url);
    return {
      color: response.data.color,
      title: response.data.title
    };
  } catch (error) {
    console.error("Error fetching color and title:", error);
    throw error;
  }
};

