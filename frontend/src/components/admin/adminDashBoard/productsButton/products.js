import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchedProducts } from "../../redux/fetchAllProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons"; // Import the list icon


const Products = () => {
  const API_URL = "http://127.0.0.1:5000";
  const token = localStorage.getItem("accessToken");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [filterType,setFilterType] =useState("product")
  const navigate = useNavigate();

  // Fetch all products on component mount

  // useEffect(() => {
  //   const fetchAllProductsData = async () => {
  //     try {
  //       // Fetch all products (pass 0 for all pages)
  //       const response = await fetchedProducts(0, token, API_URL);
  //       console.log(response, "response from fetchedProducts");
  //       console.log(response.products, "products from response");
      
  //       const inventoryData = await fetchInventory(token, API_URL);
  //       console.log(inventoryData, 'AllinventoryData');
  
  //       const inventoryProducts = inventoryData.products;
  
  //       // Assuming inventoryData is an array of inventory items with product IDs and quantities
  //       const updatedProducts = response.products.map((product) => {
  //         // Find the corresponding inventory product
  //         const inventoryProduct = inventoryProducts.find(
  //           (inventory) => inventory.id=== product.id
  //         );
  
  //         // Add remaining quantity to the product, or 'N/A' if not found
  //         product.remaining_quantity = inventoryProduct ? inventoryProduct.remaining_quantity : 'N/A';
  
  //         return product;
  //       });
  
  //       // Log the updated products to check
  //       console.log(updatedProducts, 'updatedProducts');
  
  //       // Set the state with updated products
  //       setAllProducts(updatedProducts);
  //       setProducts(updatedProducts);
  //     } catch (error) {
  //       console.error("Error fetching all products:", error);
  //       setError('Failed to fetch all products');
  //     }
  //   };
  
  //   fetchAllProductsData();
  // }, [API_URL, token]);
  
  
  // Fetch paginated products
  useEffect(() => {
    const fetchPaginatedProducts = async () => {
      try {
        // Fetch paginated products
        const response = await fetchedProducts(0, token, API_URL);
        console.log(response.products, 'paginated products');
  
        // Fetch inventory data to update remaining quantity
        
        // Update the state with the paginated products and remaining quantities
        setProducts(response.products);
        setTotalPages(response.pages); // Set total pages from response
      } catch (error) {
        console.error("Error fetching paginated products:", error);
        setError("Failed to fetch products");
      }
    };
  
    fetchPaginatedProducts();
  }, [API_URL, token, currentPage]); // Fetch data whenever the current page changes
  

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.purchase_details[0]?.date]) {
      acc[product.purchase_details[0]?.date] = {};
    }
    const purchaseNo = product.purchase_details[0]?.purchase_no || "Unknown";
    if (!acc[product.purchase_details[0]?.date][purchaseNo]) {
      acc[product.purchase_details[0]?.date][purchaseNo] = [];
    }
    acc[product.purchase_details[0]?.date][purchaseNo].push(product);
    return acc;
  }, {});
  

  

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    let searched = [];
  
    if (query.trim() === "") {
      setFilteredProducts(products); // Reset if empty query
      return;
    }
  
    if (filterType === "product") {
      searched = products.filter((product) =>
        product.name?.toLowerCase().includes(query)
      );
      console.log("Search Query:", searchQuery);
console.log("Filter Type:", filterType);
console.log("All Products:", products);
console.log("Filtered Products:", searched);
    } else if (filterType === "supplier") {
      searched = products.filter((product) =>
        product.supplier_details?.length > 0 &&
        product.supplier_details[0].name?.toLowerCase().includes(query)
      );
    } 
  
    setFilteredProducts(searched);
  };
  
  // Determine which list of products to display
  const displayProducts =
  searchQuery.length > 0
    ? filteredProducts
    : groupedProducts
    
    return (
      <div style={{ backgroundColor: '#f5f5f0', minHeight: '100vh', padding: '20px' }}>
        {error && (
          <div style={{ backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <h1 style={{ color: '#8b0000' }}>{error}</h1>
          </div>
        )}
        <h2 style={{ textAlign: 'center', color: '#654321', marginBottom: '20px' }}>Products List</h2>
    
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
                      <button
                        onClick={() => navigate('/admin-dashboard')}
                        style={{
                          backgroundColor: '#8b4513', // Dark brown button
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '8px' }} />
                        Admin Dashboard
                      </button>
                    </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                marginRight: '10px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <option value="product">Product</option>
              <option value="supplier">Supplier</option>
            </select>
            <input
              type="text"
              placeholder={`Search ${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Name`}
              value={searchQuery}
              onChange={handleSearch}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
            />
          </div>
        </div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            backgroundColor: 'white',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#d2b48c', color: '#654321' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Date Purchased</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Purchase_no</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Supplier Details</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Product Details</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(displayProducts) ? (
              displayProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{product.purchase_details?.[0]?.date}</td>
                  <td style={{ padding: '8px' }}>{product.purchase_details?.[0]?.purchase_no}</td>
                  <td style={{ padding: '12px' }}>
                    {product?.supplier_details?.[0]?.telephoneNo || 'No telephone number'}
                    <br />
                    {product?.supplier_details?.[0]?.address || 'No address provided'}
                    <br />
                    {product?.supplier_details?.[0]?.name || 'No name provided'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f0e6d2' }}>
                          <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Product Name</th>
                          <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Product Code</th>
                          <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Selling Price</th>
                          <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Remaining Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={product.id}>
                          <td style={{ padding: '8px' }}>{product.name}</td>
                          <td style={{ padding: '8px' }}>{product.code}</td>
                          <td style={{ padding: '8px' }}>{product.price_details?.[0]?.selling_price}</td>
                          <td style={{ padding: '8px' }}>{product.remaining_quantity}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))
            ) : (
              Object.keys(displayProducts).map((date) =>
                Object.keys(displayProducts[date]).map((purchaseNo) => {
                  const products = displayProducts[date][purchaseNo];
                  return (
                    <tr key={purchaseNo} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px' }}>{date}</td>
                      <td style={{ padding: '8px' }}>{purchaseNo}</td>
                      <td style={{ padding: '12px' }}>
                        {products[0]?.supplier_details?.[0]?.telephoneNo || 'No telephone number'}
                        <br />
                        {products[0]?.supplier_details?.[0]?.address || 'No address provided'}
                        <br />
                        {products[0]?.supplier_details?.[0]?.name || 'No name provided'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f0e6d2' }}>
                              <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Product Name</th>
                              <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Product Code</th>
                              <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Selling Price</th>
                              <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Remaining Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id}>
                                <td style={{ padding: '8px' }}>{product.name}</td>
                                <td style={{ padding: '8px' }}>{product.code}</td>
                                <td style={{ padding: '8px' }}>{product.price_details?.[0]?.selling_price}</td>
                                <td style={{ padding: '8px' }}>{product.remaining_quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  );
                })
              )
            )}
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
              borderRadius: '5px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
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
              borderRadius: '5px',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
};

export default Products;
