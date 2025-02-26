import React, { useState, useEffect } from 'react';
import { fetchedProducts } from '../redux/fetchAllProducts';
import { fetchInventory } from '../redux/fetchInventory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faEdit, faCheck, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';


const Selling = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [sellingprice, setSellingPrices] = useState({}); // State for new prices
    const [buyingprice, setBuyingPrice] = useState({});
    const [priceSet,setPriceSet] = useState({})
    const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  
    const API_URL = 'http://127.0.0.1:5000';
    const token = localStorage.getItem('accessToken');

    // Fetch products and initialize newPrices state
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!token) {
                    throw new Error('Authorization token is missing');
                }
    
                // Fetch all products without pagination
                const response = await fetchedProducts(0, token, API_URL);

    
                console.log(response.products, 'All products before sorting');
    
                const inventoryData = await fetchInventory(token, API_URL,null,currentPage,10);
        console.log(inventoryData, 'inventory data');
  
        const inventoryProducts = inventoryData.products;
  
                // Sort the products by selling price
                const sortedProducts = inventoryProducts.sort((a, b) => {
                    const priceA = a.price_details?.[0]?.selling_price || 0;
                    const priceB = b.price_details?.[0]?.selling_price || 0;
                    return priceA - priceB;
                });
    
                console.log(sortedProducts, 'Sorted products');
    
                // Process the sorted products
                const selling_price = {};
                const buying_price = {};
                const price_set = {};
    
                sortedProducts.forEach((product) => {
                    const purchaseDetail = product?.purchase_details?.[0];
                    if (purchaseDetail?.amount && purchaseDetail?.quantity) {
                        buying_price[product.id] = purchaseDetail.amount / purchaseDetail.quantity;
                    }
    
                    const priceDetail = Array.isArray(product?.price_details) ? product.price_details[0] : null;
                    price_set[product.id] = !!priceDetail?.selling_price;
                    selling_price[product.id] = priceDetail?.selling_price ?? '';
                });
    
                setSellingPrices(selling_price);
                setBuyingPrice(buying_price);
                setPriceSet(price_set);
    
                // Fetch inventory data
                
                // Update products with inventory details
                const updatedProducts = sortedProducts.map((product) => {
                    const inventoryProduct = inventoryProducts.find(
                        (inventory) => inventory.id === product.id
                    );
    
                    return {
                        ...product,
                        remaining_quantity: inventoryProduct ? inventoryProduct.remaining_quantity : 'N/A',
                    };
                });
    
                setProducts(updatedProducts);
                console.log(updatedProducts, 'Updated products with inventory');
            } catch (err) {
                console.error('Fetch Error:', err);
                setError(err.message);
            }
        };
    
        fetchProducts();
    }, [token]);
    
 
    const handleSetNewSellingPrice = async (productId) => {

    const selling_price = sellingprice[productId];
    const product = products.find((product)=>product.id === productId)
    const price_id = product?.price_details?.[0]?.id
    console.log(price_id,'price_id')
    
    if (!selling_price || ! price_id) {
        setError('Please enter a valid price.');
        return;
    }

    // Prompt for password input
    const password = prompt('Seems you have stumbles upon an admin privilege please Input password to confirm you are the admin:');
    if (!password) {
        setError('Password is required.');
        return;
    }

      if (!selling_price || !price_id) {
        setError('Please enter a valid price and ensure price_id exists.');
        return;
    }

    try {
        // Verify admin privileges by sending password to the backend
        const verifyRes = await fetch(`${API_URL}/verify-admin`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (!verifyRes.ok) {
            const errorData = await verifyRes.json();
            throw new Error(errorData.message || 'You are not authorized to update the price.');
        }

        // Update the selling price if the user is an admin
        const res = await fetch(`${API_URL}/prices/${price_id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selling_price: selling_price}),
        });

        if (res.ok) {
            console.log('Selling Price set successfully');
            // Optionally update the product list with the new price
            setPriceSet((prevPriceSet) => ({
                ...prevPriceSet,
                [productId]: true, // Mark this product's price as set
            }));
        } else {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update price');
        }
    } catch (err) {
        console.error('Error updating price:', err);
        setError(err.message);
    }
};


    const handlePriceChange = (productId, value) => {
        setSellingPrices((prevPrices) => ({
            ...prevPrices,
            [productId]: value,
        }));
    };

    const handleSetSellingPrice = async (productId) => {
        const selling_price = sellingprice[productId];
        if (!selling_price) {
            setError('Please enter a valid price.');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/prices`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selling_price: selling_price, product_id: productId }),
            });

            if (res.ok) {
                console.log('Selling Price set successfully');
                // Optionally update the product list with the new price
                setPriceSet((prevPriceSet) => ({
                    ...prevPriceSet,
                    [productId]: true, // Mark this product's price as set
                }));
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update price');
            }
        } catch (err) {
            console.error('Error updating price:', err);
            setError(err.message);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f5f0', color: '#5c4033', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          {error && <div style={{ color: '#a0522d', marginBottom: '10px' }}>{error}</div>}
          {products.length === 0 && !error && <p style={{ color: '#a0522d' }}>Loading products...</p>}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #d2b48c',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#d2b48c', color: '#5c4033' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #a0522d' }}>Product Name</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #a0522d' }}>Buying Price</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #a0522d' }}>Selling Price</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #a0522d' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.code} style={{ borderBottom: '1px solid #d2b48c' }}>
                  <td style={{ padding: '10px' }}>{product.name}</td>
                  <td style={{ padding: '10px' }}>
                    {product.purchase_details?.map((detail, index) => (
                      <div key={index}>
                        <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '5px' }} />
                        {(detail.amount / detail.quantity).toFixed(2)}
                      </div>
                    )) || 'No details'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <input
                      type="text"
                      placeholder="Set selling price"
                      value={sellingprice[product.id] || ''}
                      onChange={(e) => handlePriceChange(product.id, e.target.value)}
                      style={{
                        padding: '8px',
                        border: '1px solid #a0522d',
                        borderRadius: '4px',
                        width: '150px',
                        backgroundColor: 'white',
                        color: '#5c4033',
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>
                    {priceSet[product.id] ? (
                      <button
                        onClick={() => handleSetNewSellingPrice(product.id, product.price_details.id)}
                        style={{
                          backgroundColor: '#a0522d',
                          color: 'white',
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
                        Change Price
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSetSellingPrice(product.id)}
                        style={{
                          backgroundColor: '#a0522d',
                          color: 'white',
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                        Set Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                backgroundColor: '#a0522d',
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: '#a0522d',
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} style={{ marginRight: '5px' }} />
              Next
            </button>
          </div>
        </div>
      );
};

export default Selling;
