import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Import icons

const SupplierProduct = () => {
  const API_URL = "http://127.0.0.1:5000";
  const { supplierId } = useParams();
  const token = localStorage.getItem("accessToken");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/suppliers/${supplierId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          setError("");
        } else {
          const errorData = await response.json();
          setError(`Error: ${errorData.message || "Failed to fetch products"}`);
        }
      } catch (error) {
        setError("Unable to fetch supplier-products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId, token]);

  
    return (
      <div style={{ backgroundColor: '#f8f5f0', color: '#5c4033', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        {isLoading ? (
          <h2 style={{ color: '#a0522d' }}>Loading...</h2>
        ) : error ? (
          <h1 style={{ color: '#a0522d' }}>{error}</h1>
        ) : (
          <>
            <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #a0522d', paddingBottom: '10px' }}>Associated Products</h2>
            <Link to="/suppliers?triggerFetch=True" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  backgroundColor: '#a0522d',
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
                Back
              </button>
            </Link>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#d2b48c', color: '#5c4033' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Product Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Product Code</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #d2b48c' }}>
                    <td style={{ padding: '10px' }}>{product.name}</td>
                    <td style={{ padding: '10px' }}>{product.code}</td>
                    <td style={{ padding: '10px' }}>
                      <button
                        style={{
                          backgroundColor: '#a0522d',
                          color: 'white',
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={() => navigate(`/supplier_purchasedetails/${product.id}`)}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }} />
                        View Purchase Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
};

export default SupplierProduct;
