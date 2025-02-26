import { useEffect, useState } from "react";
import { fetchCreditSales } from "../redux/fetchCreditSale";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'; // Import the dashboard icon


const FetchingCashSales = () => {
  const [sales, setSales] = useState([]);
  const token = localStorage.getItem('accessToken');
  const API_URL = 'http://127.0.0.1:5000';
  const [error, setError] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchedSales = async () => {
      try {
        const data = await fetchCreditSales(token, API_URL);
        setSales(data);
        console.log('sales', data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchedSales();
  }, [API_URL]);

  const groupedSales = sales.reduce((acc, sale) => {
    if (!acc[sale.credit_sale_number]) {
      acc[sale.credit_sale_number] = [];
    }
    acc[sale.credit_sale_number].push(sale);
    return acc;
  }, {});

  // Calculate total sales amount
  const totalSalesAmount = sales.reduce((total, sale) => total + parseFloat(sale.sale_amount || 0), 0);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!sales || sales.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: '16px', backgroundColor: '#f8f5f0' }}> {/* Light brown background */}
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
    </div><br/>
  <table
    style={{
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      backgroundColor: 'white', // White table background
      border: '1px solid #d2b48c', // Brown table border
    }}
  >
    <thead>
      <tr style={{ backgroundColor: '#d2b48c', color: 'white' }}> {/* Brown header with white text */}
        <th style={{ padding: '8px', border: '1px solid #d2b48c' }}>Cs_number</th>
        <th style={{ padding: '8px', border: '1px solid #d2b48c' }}>Date</th>
        <th style={{ padding: '8px', border: '1px solid #d2b48c' }}>Customer Number</th>
        <th style={{ padding: '8px', border: '1px solid #d2b48c' }}>Actions</th> {/* Added Actions Header */}
      </tr>
    </thead>
    <tbody>
      {Object.keys(groupedSales).map((cs_number) => (
        <tr key={cs_number}>
          <td style={{ padding: '8px', border: '1px solid #d2b48c' }}>{cs_number}</td>
          <td style={{ padding: '8px', border: '1px solid #d2b48c' }}>
            {groupedSales[cs_number][0].date}
          </td>
          <td style={{ padding: '8px', border: '1px solid #d2b48c' }}>
            {groupedSales[cs_number][0].customer_tel_no}
          </td>
          <td style={{ padding: '8px', border: '1px solid #d2b48c' }}>
            <button
              onClick={() =>
                navigate('/creditsale-products', {
                  state: { groupedSales: groupedSales },
                })
              }
              style={{
                backgroundColor: '#8b4513', // Dark brown button
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Associated Products
            </button>
          </td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="3" style={{ padding: '8px', border: '1px solid #d2b48c', textAlign: 'right' }}>
          <strong>Total:</strong>
        </td>
        <td style={{ padding: '8px', border: '1px solid #d2b48c' }}>
          <strong>Kshs.{totalSalesAmount.toFixed(2)}</strong>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
  );
};

export default FetchingCashSales;
