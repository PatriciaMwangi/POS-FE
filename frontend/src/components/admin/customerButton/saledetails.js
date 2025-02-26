import { useEffect, useState } from "react";
import { fetchCashSale } from "../redux/fetchCashSale";
import { useNavigate } from "react-router-dom";

const Cashsale = () => {
  const [sales, setSales] = useState([]); // Initialize with an empty array
  const [error, setError] = useState('');
  const API_URL = 'http://127.0.0.1:5000';
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchedCashSale = async () => {
      try {
        const data = await fetchCashSale(token, API_URL); // Await the fetchCashSale promise
        setSales(data || []); // Ensure data is an array, fallback to an empty array
        console.log('cashsaledetails', data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchedCashSale();
  }, [token, API_URL]);

  return (
    <>
      <div className="card text-center">
        <div className="card-header">CashSale Details</div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <ul className="list-group list-group-flush">
            {sales.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>Amount Sold:</strong> {item.sale_amount}
                <br />
                <strong>Quantity:</strong> {item.sale_quantity}
                <br />
                <strong>Date:</strong> {item.date}
                <br />
                <strong>Discount:</strong> {item.sale_discount}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="btn btn-primary"
          >
            Admin-Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default Cashsale;
