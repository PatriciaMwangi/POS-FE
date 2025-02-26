// api.js
export const fetchPurchaseDetails = async (purchaseId, token, API_URL) => {
  try {
    const response = await fetch(`${API_URL}/purchasedetails/${purchaseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json(); // Return the fetched data
    } else {
      const errorData = await response.json();
      throw new Error(errorData.msg); // Throw error for non-OK response
    }
  } catch (error) {
    throw new Error('Failed to fetch purchase details'); // Handle fetch errors
  }
};
