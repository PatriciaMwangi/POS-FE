export const fetchedProducts = async (page, token, API_URL) => {
    const url = page === 0
        ? `${API_URL}/products?inventory=true&selling_price=true`
        : `${API_URL}/products?page=${page}&inventory=true&selling_price=true`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is ok
        if (response.ok) {
            const data = await response.json();

            // Validate data structure before proceeding
            if (!data.products || !Array.isArray(data.products)) {
                throw new Error("Invalid products data format");
            }

            // Sort products by selling price (if applicable)
            const sortedProducts = data.products.sort((a, b) => {
                const sellingPriceA = a.price_details?.[0]?.selling_price || 0;
                const sellingPriceB = b.price_details?.[0]?.selling_price || 0;

                return sellingPriceA - sellingPriceB;
            });

            return { ...data, products: sortedProducts };
        } else {
            const error = await response.json();
            console.error("API Error:", error);
            throw new Error(error.msg || "Failed to fetch product details");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        throw new Error("Failed to fetch product details");
    }
};
