import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './customer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUser, faMapMarkerAlt, faShoppingCart, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const AddCustomers = () => {
  const [name, setName] = useState("");
  const [tel_no, setTel_no] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:5000";

  // Helper function to fetch customer by telephone number
  const fetchCustomer = async (telNo) => {
    if (!/^\d{10}$/.test(telNo)){
      setError('Telephone number must have 10 digits')
      return;
    }
    setError("")
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/customers?tel_no=${telNo}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setAddress(data.address);
        setError("");
      } else if (response.status === 404) {
        setName("");
        setAddress("");
        setError("Customer not found. Please fill in the details to register.");
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.msg}`);
      }
    } catch {
      setError("Failed to fetch customer details.");
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func,delay) =>{
    let timer;
    return(...args)=>{
      clearTimeout(timer)
      timer = setTimeout(()=>func(...args,delay))
    }
  }

  const debouncedFetch = debounce((telNo) => fetchCustomer(telNo,500))

  const handleTelChange = (e) =>{
    setTel_no(e.target.value)
    localStorage.setItem('customer_tel_no',e.target.value)
    debouncedFetch(e.target.value)
  }


  // Handle form submission to add customer
  const handlePost = async (e) => {
    e.preventDefault();
    if (!name || !tel_no || !address) {
        setError("Name, telephone number, and address are required.");
        return;
    }

    setError("");
    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, tel_no, address }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data,'customer')
            localStorage.setItem("customer_id", data.customer.id);
            if (e.nativeEvent.submitter.innerText === "Cashsale") {
        navigate("/cashsale-product");
      } else if (e.nativeEvent.submitter.innerText === "CreditSale") {
        navigate("/creditsale-product");
      }
        } else {
            const errorData = await response.json();
            setError(`Error: ${errorData.msg}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to add customer. Please try again.");
    } finally {
        setLoading(false);
    }
};


return (
  <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
<div className="customer-details-card">
<h2 className="text-center mb-4" style={{ color: '#a37427' }}>Customer Details</h2>
      <form onSubmit={handlePost}>
        <div className="mb-3">
          <label htmlFor="telNo" className="form-label" style={{ color: '#6b3e26' }}>
            <FontAwesomeIcon icon={faPhone} className="me-2" style={{ color: '#6b3e26' }} />
            Telephone Number
          </label>
          <input
            type="text"
            id="telNo"
            className="form-control"
            value={tel_no}
            onChange={handleTelChange}
            maxLength="10"
            placeholder="Enter 10-digit telephone number"
            required
            style={{ borderColor: '#6b3e26' }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label" style={{ color: '#6b3e26' }}>
            <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#6b3e26' }} />
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
            style={{ borderColor: '#6b3e26' }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label" style={{ color: '#6b3e26' }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" style={{ color: '#6b3e26' }} />
            Address
          </label>
          <input
            type="text"
            id="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
            style={{ borderColor: '#6b3e26' }}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit"
           className="btn btn-primary" 
           onClick={() => navigate('/cashsale-product')}
           style={{ backgroundColor: '#6b3e26', borderColor: '#6b3e26' }}
           >
            <FontAwesomeIcon icon={faShoppingCart} className="me-1" /> Cash Sale
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/creditsale-product')}
            style={{ backgroundColor: '#a0522d', borderColor: '#a0522d' }}
          >
            <FontAwesomeIcon icon={faCreditCard} className="me-1" /> Credit Sale
          </button>
        </div>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  </div>
);
};

export default AddCustomers;
