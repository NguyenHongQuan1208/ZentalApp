import axios from "axios";

// URL of Firebase Realtime Database
const BACKEND_URL =
  "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app";

// Function to get all task sections
export const getAllTaskSections = async () => {
  try {
    // Construct the URL for fetching all task sections
    const url = `${BACKEND_URL}/taskSections.json`; // Adjust the path as needed

    // Make the GET request to fetch all task sections
    const response = await axios.get(url);

    // Convert the object to an array
    const sectionsArray = response.data ? Object.values(response.data) : [];

    // Return the task sections data as an array
    return sectionsArray;
  } catch (error) {
    console.error("Error fetching task sections:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};

export default getAllTaskSections;
