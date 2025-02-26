import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';


const CustomersProduct = () => {
  const API_URL = "http://127.0.0.1:5000";
  const token = localStorage.getItem("accessToken");
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safe extraction of customerId from location.state
  const customerId = location.state ? location.state.customerId : null;

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`${API_URL}/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCustomerData(data); // Save entire customer data
          console.log(customerData,'customer')
        } else {
          const errorData = await response.json();
          setError(`Error: ${JSON.stringify(errorData)}`);
        }
      } catch (error) {
        setError("Unable to fetch customer data.");
      }
    };

    fetchCustomerData();
  }, [token, customerId]);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!customerData) {
    return <h1>Loading...</h1>;
  }

  return <CustomerDetails customer={customerData} navigate={navigate} />;
};

const CustomerDetails = ({ customer, navigate }) => {
  // Group cash sale details by cs_number
  const groupedDetails = customer.cashsaledetails.reduce((acc, detail) => {
    const { cs_number } = detail;
    if (!acc[cs_number]) {
      acc[cs_number] = [];
    }
    acc[cs_number].push(detail);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f5f0', color: '#333' }}>
  <div style={{ padding: '20px', backgroundColor: '#d2b48c', color: '#fff', marginBottom: '20px' }}>
    <h2 style={{ margin: '0' }}>Associated Products</h2>
  </div>
<div>
          <Link
            to="/customers?triggerFetch=True"
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faUserTie} className="me-2" /> Customers
          </Link>
        </div>

  <div style={{ padding: '20px' }}>
    <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px solid #d2b48c' }}>
      <thead>
        <tr style={{ backgroundColor: '#d2b48c', color: '#fff' }}>
          <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>CS Number</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Product Name</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Product Code</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Sale Amount</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Sale Quantity</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Sale Discount</th>
        </tr>
      </thead>
      <tbody>
        {customer.cashsaledetails.map((cashSale) => (
          cashSale.details.map((detail, index) => (
            <tr key={`${cashSale.cs_number}-${index}`} style={{ borderBottom: '1px solid #d2b48c' }}>
              {index === 0 && (
                <td rowSpan={cashSale.details.length} style={{ padding: '10px' }}>
                  {detail.date ? new Date(detail.date).toLocaleDateString() : "N/A"}
                </td>
              )}
              {index === 0 && (
                <td rowSpan={cashSale.details.length} style={{ padding: '10px' }}>
                  {cashSale.cs_number}
                </td>
              )}
              <td style={{ padding: '10px' }}>{detail.product?.name || "N/A"}</td>
              <td style={{ padding: '10px' }}>{detail.product?.code || "N/A"}</td>
              <td style={{ padding: '10px' }}>{detail.sale_amount}</td>
              <td style={{ padding: '10px' }}>{detail.sale_quantity}</td>
              <td style={{ padding: '10px' }}>{detail.sale_discount}</td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default CustomersProduct;
