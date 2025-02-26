import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:5000';

export const EditPurchaseDetails = () => {
  const { purchaseid } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState({
    amount: '',
    quantity: '',
    date: '',
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/purchasedetails/${purchaseid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPurchase(data);
        } else {
          setError('Failed to fetch purchase details');
        }
      } catch (err) {
        setError('Error fetching data');
      }
    };
    fetchPurchaseDetails();
  }, [purchaseid, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchase({ ...purchase, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/purchasedetails/${purchaseid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(purchase),
      });

      if (response.ok) {
        navigate(`/purchase-details/${purchaseid}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update purchase details');
      }
    } catch (err) {
      setError('Error updating purchase details');
    }
  };

  if (error) return <h1>{error}</h1>;

  return (
    <div className="container mt-4">
      <h2>Edit Purchase Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="amount"
            value={purchase.amount}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={purchase.quantity}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={purchase.date}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate(`/purchase-details/${purchaseid}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
