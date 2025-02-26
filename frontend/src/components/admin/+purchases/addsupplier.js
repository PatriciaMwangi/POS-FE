import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


const AddSupplier = () => {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const API_URL = 'http://127.0.0.1:5000';


  //  telephoneNo validation
  // Function to fetch supplier details by telephone number
  const fetchSupplierByTelephone = async (telNo) => {
    if (!/^\d{10}$/.test(telNo)){
setError('telephone number must be comprised of 10 digits')
return;
    }
setError("")
    try {
      const response = await fetch(`${API_URL}/suppliers?telephoneNo=${telNo}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data,'supplier')
        setName(data.supplier.name);
        setAddress(data.supplier.address);
        setError(data.msg)
      } else if (response.status === 404) {
        // Clear name and address if not found
        setName('');
        setAddress('');
        setError(data.msg);

      } 
      else if (response.status === 209) {
        // Handle case where supplier is not found but backend provides a message
        setName('');
        setAddress('');
        setError(data.msg); // Display the message from the backend
      }else {
        const errorData = await response.json();
        console.log(` ${errorData.msg}`)
        setError(`Error: ${errorData.msg}`);
      }
    } catch (error) {
      setError('Seems the client is not in our system kindly register details to proceed');
      setName("")
      setAddress("")
    }
  };

const debounce = (func,delay) =>{
  let timer;
  return(...args)=>{
  clearTimeout(timer)
  timer = setTimeout(()=> func(...args,delay))
}
}
const debouncedFetch = debounce((telNo)=> fetchSupplierByTelephone(telNo,500))

const handelTelChange = (e) =>{
  setTelephone(e.target.value)
  debouncedFetch(e.target.value)
}

  const handlePost = async (e) => {
    e.preventDefault();

    if (!name || !telephone || !address) {
      setError('Name, telephone number, and address must be provided');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, telephoneNo: telephone, address }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Supplier details added:", data);
        localStorage.setItem('supplier_id', data.supplier.id);
        console.log('supplier_id',data.supplier.id)
        navigate('/new-purchasedetails');
      } else if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.msg);
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.msg}`);
      }
    } catch (error) {
      setError('Failed to include supplier details');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f5f0',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          color: '#5c4033',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '5000px',
          margin: '0 auto',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ marginBottom: '20px', borderBottom: '2px solid #a0522d', paddingBottom: '10px' }}>New Supplier</h1>
        <form onSubmit={handlePost}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="telNo" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', color: '#a0522d' }}>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '5px' }} />
              Telephone Number
            </label>
            <input
              type="text"
              id="telNo"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d2b48c',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#5c4033',
                boxSizing: 'border-box',
              }}
              value={telephone}
              onChange={handelTelChange}
              maxLength="10"
              placeholder="Enter 10-digit telephone number"
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', color: '#a0522d' }}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
              Name
            </label>
            <input
              type="text"
              id="name"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d2b48c',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#5c4033',
                boxSizing: 'border-box',
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="address" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', color: '#a0522d' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '5px' }} />
              Address
            </label>
            <input
              type="text"
              id="address"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d2b48c',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#5c4033',
                boxSizing: 'border-box',
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#a0522d',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit & Add Product Details'}
          </button>
        </form>
        {error && (
          <p style={{ color: '#a0522d', marginTop: '15px', textAlign: 'center' }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default AddSupplier;
