import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'; // Import the boxes icon


const SupplierProducts = () => {
    const API_URL = "http://127.0.0.1:5000"
    const token = localStorage.getItem('accessToken')
    const [suppliers,setSuppliers] = useState([])
    const [error,setError] = useState("")
    const navigate = useNavigate()
    

    useEffect(() => {
        const fetchedSuppliers = async () => {
    try{
        const response = await fetch(`${API_URL}/suppliers`,{
            headers:{
                Authorization: `Bearer${token}`
            },
        });
        if (response.ok){
const data =await response.json()
console.log(data)
setSuppliers(data)
        } else{
const errorData = await response.json()
setError(`error: ${errorData}`)
        }
    }catch(error){
    setError('Failed to fetch suppliers')
    }
};
fetchedSuppliers()
},[token])

return (
  <>
    <div style={{ backgroundColor: '#f8f5f0', color: '#5c4033', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {error && <h1 style={{ color: '#a0522d' }}>{error}</h1>}
      <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #a0522d', paddingBottom: '10px' }}>Suppliers List</h2>
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
                
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#d2b48c', color: '#5c4033' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Supplier Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Supplier Telephone</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Supplier Address</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Products Supplied</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} style={{ borderBottom: '1px solid #d2b48c' }}>
              <td style={{ padding: '10px' }}>{supplier.name}</td>
              <td style={{ padding: '10px' }}>{supplier.telephoneNo}</td>
              <td style={{ padding: '10px' }}>{supplier.address}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => navigate(`/supplier-products/${supplier.id}`)}
                  style={{
                    backgroundColor: '#a0522d',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <FontAwesomeIcon icon={faBoxes} style={{ marginRight: '5px' }} /> {/* Add the icon */}
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);
}

export default SupplierProducts