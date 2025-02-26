import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Customers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl,faTachometerAlt } from "@fortawesome/free-solid-svg-icons"; // Import the list icon



const Customers = () => {
  const API_URL = "http://127.0.0.1:5000";
  const token = localStorage.getItem("accessToken");
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchedCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          const errorData = await response.json();
          setError(`Error: ${errorData}`);
        }
      } catch (error) {
        setError("Failed to fetch customers");
      }
    };
    fetchedCustomers();
  }, [token]);

  const handleOpenModal = (customer) => {
    setSelectedCustomer(customer);
    setOpenModal(true);
  };

  const handleNavigate = (path, customer) => {
    navigate(path, {
      state: { customerId: customer.id },
    });
    setOpenModal(false);
  };

  return (
    <div className="customers-container">
      {error && <h1 className="error-message">{error}</h1>}
      <h2 className="customers-title">Customers List</h2>
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
      <table className="customers-table">
        <thead>
          <tr>
            <th>Customer's Name</th>
            <th>Customer's Telephone</th>
            <th>Customer's Address</th>
            <th>Products Bought</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.tel_no}</td>
              <td>{customer.address}</td>
              <td>
              <FontAwesomeIcon
                  icon={faListUl}
                  className="products-icon"
                  onClick={() => handleOpenModal(customer)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {openModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button className="btn-close" onClick={() => setOpenModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Show products bought on:</p>
              </div>
              <div className="modal-footer">
                <button
                  className="modal-button secondary"
                  onClick={() => handleNavigate("/customer-credit-products", selectedCustomer)}
                >
                  Credit
                </button>
                <button
                  className="modal-button primary"
                  onClick={() => handleNavigate("/customer-cash-products", selectedCustomer)}
                >
                  Cash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;