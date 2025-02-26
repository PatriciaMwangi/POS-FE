export const fetchCreditSales = async (token, API_URL) => {
    try {
      const response = await fetch(`${API_URL}/creditsaledetails`, { 
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type':'application/json'
        },
      });
  
      if (response.ok) {
        console.log('Response:', response);
        return await response.json();
      } else {
        const error = await response.json(); 
        throw new Error(error.message || 'Failed to fetch sales');
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch product details');
    }
  };
  