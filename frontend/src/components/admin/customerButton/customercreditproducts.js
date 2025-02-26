import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';

const CustomersCreditProduct = () => {
  const API_URL = "http://127.0.0.1:5000";
  const token = localStorage.getItem("accessToken");
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
          setCustomerData(data);
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

  return <CreditCustomerDetails customer={customerData} navigate={navigate} />;
};

const CreditCustomerDetails = ({ customer, navigate }) => {
  // Group credit sale details by date and then by credit_sale_number
  const groupedDetails = customer.creditsaledetails.reduce((acc, creditSale) => {
    creditSale.details.forEach(detail => {
      if (!detail.date) {
        console.warn("Date is missing in credit sale detail:", detail);
        return;
      }

      const date = new Date(detail.date);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", detail.date);
        return;
      }

      const formattedDate = date.toLocaleDateString();
      const { credit_sale_number } = creditSale;

      if (!acc[formattedDate]) {
        acc[formattedDate] = {};
      }

      if (!acc[formattedDate][credit_sale_number]) {
        acc[formattedDate][credit_sale_number] = [];
      }

      acc[formattedDate][credit_sale_number].push({ ...detail, credit_sale_number, formattedDate }); // Include credit_sale_number and formattedDate in detail
    });
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f5f0', color: '#333' }}>
      <div style={{ padding: '20px', backgroundColor: '#d2b48c', color: '#fff', marginBottom: '20px' }}>
        <h2 style={{ margin: '0' }}>Associated Credit Products</h2>
      </div>
      <div>
        <Link to="/customers?triggerFetch=True" style={{ color: '#5c3d2e' }}>
          <FontAwesomeIcon icon={faUserTie} className="me-2" /> Customers
        </Link>
      </div>

      <div style={{ padding: '20px' }}>
        {Object.entries(groupedDetails).map(([date, creditSalesByDate]) => (
          <div key={date} style={{ marginBottom: '20px' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px solid #d2b48c' }}>
              <thead>
                <tr style={{ backgroundColor: '#d2b48c', color: '#fff' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Credit Sale Number</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Product Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Product Code</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Sale Amount</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Sale Quantity</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Sale Discount</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(creditSalesByDate).map(details => (
                  details.map((detail, index) => (
                    <tr key={`${detail.credit_sale_number}-${index}`} style={{ borderBottom: '1px solid #d2b48c' }}>
                      {index === 0 && (
                        <td rowSpan={details.length} style={{ padding: '10px' }}>
                          {detail.formattedDate}
                        </td>
                      )}
                      {index === 0 && (
                        <td rowSpan={details.length} style={{ padding: '10px' }}>
                          {detail.credit_sale_number}
                        </td>
                      )}
                      <td style={{ padding: '10px' }}>{detail.product?.name || "N/A"}</td>
                      <td style={{ padding: '10px' }}>{detail.product?.code || "N/A"}</td>
                      <td style={{ padding: '10px' }}>{detail.cs_amount}</td>
                      <td style={{ padding: '10px' }}>{detail.cs_quantity}</td>
                      <td style={{ padding: '10px' }}>{detail.sale_discount}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersCreditProduct;