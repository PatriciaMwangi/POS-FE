import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './navBar';
import { useEffect, useState } from 'react';
import { useUserContext } from '../userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchCashSale } from '../redux/fetchCashSale';
import { fetchCreditSales } from '../redux/fetchCreditSale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './aD.css'
import {
  faBox,
  faShoppingCart,
  faUserFriends,
  faTruck,
  faTrash,
  faMoneyBill,
  faTags,
} from '@fortawesome/free-solid-svg-icons';


const Admin = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const API_URL = "http://127.0.0.1:5000";
  const [showModal, setShowModal] = useState(false);
  const [cashsales,setCashSales] = useState([])
  const [creditsales,setCreditSales] =useState([])
  const [error, setError] = useState('');
  const token = localStorage.getItem("accessToken");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar,setShowCalendar]=useState(false)


  useEffect(() => {
    const loggedInUser = location.state?.is_admin;
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    }
  }, [location.state, setUser]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close calendar after date selection
  };

  const handleNavigate = (path) => {
    setShowModal(false);
    navigate(path);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar); // Toggle calendar visibility
  };

  const handleSalesClick = () => setShowModal(true);

  const isAdmin = user === 1 || user === '1';
  const today = new Date().toISOString().slice(0, 10);

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
     const fetchDetails = async () => {
       try {
         const cashresponse = await fetchCashSale(token, API_URL);
         const creditresponse = await fetchCreditSales(token,API_URL)
const formattedDate = selectedDate.toISOString().slice(0, 10); // Format selected date

const todaysCashSales = cashresponse.filter(sale => {
  const saleDate = new Date(sale.date).toISOString().slice(0, 10);
  return saleDate === formattedDate;
});      
const todaysCreditSales = creditresponse.filter(sale => {
  const saleDate = new Date(sale.date).toISOString().slice(0, 10);
  return saleDate === formattedDate;
});

      setCashSales(todaysCashSales);
      setCreditSales(todaysCreditSales);

         console.log(todaysCashSales,'cashsales');
         console.log(todaysCreditSales,'creditsales');

       } catch (err) {
         console.error("Error fetching sales details:", err);
         setError("Failed to fetch sales details.");
       }
     };
 
     if (token) {
       fetchDetails();
     }
   }, [token,selectedDate]);


   const combinedSales = [...cashsales, ...creditsales].sort((a, b) => {
    return new Date(a.date) - new Date(b.date); // Sort by date/time
  });

  const formatServiceType = (sale) => {
    if (cashsales.some(cashSale => cashSale.id === sale.id)) {
      return "Cash Sale";
    } else if (creditsales.some(creditSale => creditSale.id === sale.id)) {
      return "Credit Sale";
    } else {
      return "Unknown"; // Handle cases where the sale is not found
    }
  };

  const calculateRemainingBalance = (sale) => {
    if (sale.selling_price && sale.sale_quantity && sale.sale_amount) {
      const originalPrice = parseFloat(sale.selling_price) * parseFloat(sale.sale_quantity);
      const paidAmount = parseFloat(sale.sale_amount);
      const remainingBalance = originalPrice - paidAmount;
      return `-${remainingBalance.toFixed(2)}`; // Format to 2 decimal places
    } else {
      return 'N/A'; // Handle cases where data is missing
    }
  };
 

  return (
    <>
      <NavBar isAdmin={isAdmin} />
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="container-fluid" style={{ backgroundColor: '#f8f0e3' }}>
  <nav
    className="navbar navbar-expand-lg navbar-light"
    style={{ backgroundColor: '#d2b48c' }}
  >
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            onClick={() => navigate('/products')}
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faBox} className="me-2" /> Products
          </button>
        </li>
        <li className="nav-item">
          <Link
            to="/customers?triggerFetch=True"
            className="nav-link btn btn-link"
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faUserFriends} className="me-2" /> Customers
          </Link>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            onClick={handleSalesClick}
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Sales
          </button>
        </li>
        <li className="nav-item">
          <Link
            to="/suppliers?triggerFetch=True"
            className="nav-link btn btn-link"
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faTruck} className="me-2" /> Suppliers
          </Link>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            onClick={() => navigate('/deleted-products')}
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" /> Bin
          </button>
        </li>
        <li className="nav-item">
          <Link
            to="/purchases?triggerFetch=True"
            className="nav-link btn btn-link"
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faMoneyBill} className="me-2" /> Purchases
          </Link>
        </li>
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            onClick={() => navigate('/selling_price')}
            style={{ color: '#5c3d2e' }}
          >
            <FontAwesomeIcon icon={faTags} className="me-2" /> Set Selling Price
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <main className="p-3">
    <section
      className="summary"
      style={{
        backgroundColor: '#e6d9c4',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'inline-block', marginRight: '20px' }}>
        <strong>{combinedSales.length}</strong>
        <span>Total Orders</span>
        <br />
        <strong>
          {combinedSales.reduce(
            (total, sale) => total + parseFloat(sale.sale_amount),
            0
          )}
        </strong>
        <span>Total Order Value</span>
      </div>
      <div style={{ display: 'inline-block', marginRight: '20px' }}>
        <strong>{cashsales.length}</strong>
        <span>Total Cash Sales Orders</span>
        <br />
        <strong>
          {Array.isArray(cashsales)
            ? cashsales.reduce(
                (total, sale) => total + parseFloat(sale.sale_amount),
                0
              )
            : 0}
        </strong>
        <span>Total Cash Sales Value</span>
      </div>
      <div style={{ display: 'inline-block' }}>
        <strong>{creditsales.length}</strong>
        <span>Total Credit Sales Orders</span>
        <br />
        <strong>
          {Array.isArray(creditsales)
            ? creditsales.reduce(
                (total, sale) => total + parseFloat(sale.sale_amount),
                0
              )
            : 0}
        </strong>
        <span>Total Credit Sales Value</span>
      </div>
    </section>

    <section className="order-list">
      <button
        onClick={toggleCalendar}
        style={{
          backgroundColor: '#d2b48c',
          color: '#5c3d2e',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      >
        Day
      </button>
      {showCalendar && (
        <div className="calendar-container">
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
      )}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#e6d9c4', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Time
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Customer
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Service Type
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Item Name
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Qty
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Status
            </th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#5c3d2e' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {combinedSales &&
            combinedSales.map((sale) => (
              <tr
                key={sale.id}
                style={{ borderBottom: '1px solid #ddd', color: '#5c3d2e' }}
              >
                <td style={{ padding: '10px' }}>{formatTime(sale.date)}</td>
                <td style={{ padding: '10px' }}>{sale.customer_name}</td>
                <td style={{ padding: '10px' }}>{formatServiceType(sale)}</td>
                <td style={{ padding: '10px' }}>{sale.product_name}</td>
                <td style={{ padding: '10px' }}>{sale.sale_quantity}</td>
                <td style={{ padding: '10px' }}>
                  {formatServiceType(sale) === 'Cash Sale'
                    ? 'Completed'
                    : calculateRemainingBalance(sale)}
                </td>
                <td style={{ padding: '10px' }}>{sale.sale_amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  </main>
</div>

{showModal && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content" style={{ backgroundColor: '#f8f5f0' }}> {/* Light brown background */}
        <div className="modal-header" style={{ borderBottom: '1px solid #d2b48c' }}> {/* Brown border */}
          <h5 className="modal-title" style={{ color: '#333' }}>Choose Action</h5> {/* Dark gray/black for title */}
          <button
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>
        <div className="modal-body" style={{ color: '#555' }}> {/* Darker gray for body text */}
          <p>Select an option to proceed:</p>
        </div>
        <div className="modal-footer" style={{ borderTop: '1px solid #d2b48c' }}> {/* Brown border */}
          <button
            className="btn btn-secondary"
            onClick={() => handleNavigate('/creditsales')}
            style={{ backgroundColor: '#d2b48c', borderColor: '#d2b48c', color: 'white' }} // Brown buttons
          >
            Show Credit Sales
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleNavigate('/cashsales')}
            style={{ backgroundColor: '#8b4513', borderColor: '#8b4513', color: 'white' }} // Darker brown buttons
          >
            Show Cash Sales
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Admin;