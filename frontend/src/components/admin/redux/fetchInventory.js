export const fetchInventory = async (token, API_URL, productId = null, page = 1, perPage = 10) => {
    try {
        // Construct the endpoint based on whether productId is provided
        const endpoint = productId 
            ? `${API_URL}/products/${productId}/inventory?inventory=true`
            : `${API_URL}/products?inventory=true&page=${page}&per_page=${perPage}`;

        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log(response, 'res');
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch inventory');
        }
    } catch (err) {
        throw new Error(err.message || 'Failed to fetch inventory');
    }
};
