import { useEffect, useState } from 'react';
import { useParams,useNavigate,Link } from 'react-router-dom';
import { fetchedProduct } from '../redux/fetchSingleProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faHome, faList } from '@fortawesome/free-solid-svg-icons';

export const SupplierPurchaseDetails = () => {
  const { productId } = useParams();
  const [purchase, setPurchase] = useState([]);
  const [error, setError] = useState(null);
  const supplierId = localStorage.getItem('supplier_id')
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate()
  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchedPurchaseDetails = async () => {
      try {
        const data = await fetchedProduct(productId, token, API_URL);
        setPurchase(data.purchase_details || []);
        console.log(data.purchase_details);
      } catch (error) {
        setError('Failed to fetch purchase details');
      }
    };
    fetchedPurchaseDetails();
  }, [productId, token]);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!purchase.length) {
    return <h1>Loading...</h1>;
  }

 
      return (
    <div style={{ backgroundColor: '#f8f5f0', color: '#5c4033', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div style={{ backgroundColor: '#d2b48c', padding: '10px', borderRadius: '5px 5px 0 0', textAlign: 'center' }}>
          <h2 style={{ color: '#5c4033', margin: 0 }}>Purchase Details</h2>
        </div>
        <div style={{ padding: '20px' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {purchase.map((item, index) => (
              <li
                key={index}
                style={{
                  borderBottom: '1px solid #d2b48c',
                  padding: '10px 0',
                }}
              >
                <strong style={{ color: '#a0522d' }}>Amount:</strong> {item.amount}
                <br />
                <strong style={{ color: '#a0522d' }}>Quantity:</strong> {item.quantity}
                <br />
                <strong style={{ color: '#a0522d' }}>Date:</strong> {item.date}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => navigate(`/supplier-products/${supplierId}`)}
              style={{
                backgroundColor: '#a0522d',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
              Back
            </button>
            <a
              href={`/edit-purchase/${productId}`}
              style={{
                backgroundColor: '#a0522d',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                pointerEvents: 'none', // Disable click events
                opacity: 0.5, // Visually indicate disabled state
              }}
            >
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
              Edit
            </a>
            <button
              onClick={() => navigate('/admin-dashboard')}
              style={{
                backgroundColor: '#a0522d',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <FontAwesomeIcon icon={faHome} style={{ marginRight: '5px' }} />
              Admin Dashboard
            </button>
            <Link to="/suppliers?triggerFetch=True" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  backgroundColor: '#a0522d',
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />
                Supplier List
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
