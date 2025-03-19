import axios from "axios";

// URL of Firebase Realtime Database
const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Function to fetch the defaultImageUri by section ID
export const fetchDefaultImageUriBySectionId = async (sectionId) => {
  try {
    // Construct the URL for fetching the section data
    const url = `${BACKEND_URL}/taskSections/${sectionId}.json`; // Adjust the path as needed

    // Make the GET request to fetch the section data
    const response = await axios.get(url);

    // Return the defaultImageUri
    return response.data.defaultImageUri;
  } catch (error) {
    console.error("Error fetching defaultImageUri:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};
