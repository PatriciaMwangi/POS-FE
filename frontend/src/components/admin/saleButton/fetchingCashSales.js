import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCashSale } from "../redux/fetchCashSale";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';


const FetchingCashSales = () => {
  const [sales, setSales] = useState([]);
  const [editCsNumber, setEditCsNumber] = useState(null);
  const [editedSales, setEditedSales] = useState([]);
  const token = localStorage.getItem("accessToken");
  const [searchQuery,setSearchQuery] = useState("")
  const API_URL = "http://127.0.0.1:5000";
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchedSales = async () => {
      try {
        const data = await fetchCashSale(token, API_URL);
        setSales(data);
        console.log("sales", data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchedSales();
  }, [API_URL]);
  const filteredSales = sales.filter((sale) => {
    const searchStr = searchQuery.toLowerCase();
    return (
      sale.product_name.toLowerCase().includes(searchStr) ||
      sale.date.toLowerCase().includes(searchStr) ||
      sale.customer_tel_no.toLowerCase().includes(searchStr)
    );
  });

  const groupedSales = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.date]) {
      acc[sale.date] = [];
    }
    acc[sale.date].push(sale);
    return acc;
  }, {});



//   const handleEditClick = async (cs_number, date) => { // Add date parameter
//     setEditCsNumber(cs_number);

//     if (groupedSales[date] && groupedSales[date][cs_number]) { // Check if date and cs_number exist
//         setEditedSales(groupedSales[date][cs_number].map((sale) => ({ ...sale })));
//     } else {
//         console.error(`Sales data not found for cs_number: ${cs_number} and date: ${date}`);
//         return; // Exit if data not found
//     }

//     const password = prompt('Seems you have stumbles upon an admin privilege please Input password to confirm you are the admin:');

//     if (!password) {
//         setError('Password is required.');
//         return;
//     }

//      try {
//          // Verify admin privileges by sending password to the backend
//          const verifyRes =  await fetch(`${API_URL}/verify-admin`, {
//              method: 'POST',
//              headers: {
//                  Authorization: `Bearer ${token}`,
//                  'Content-Type': 'application/json',
//              },
//              body: JSON.stringify({ password }),
//          });
 
//          if (!verifyRes.ok) {
//              const errorData = await verifyRes.json();
//              throw new Error(errorData.message || 'You are not authorized to update the price.');
//          }
 
//   }
//   catch(err){
// setError(err)
//   }}

//   const handleInputChange = (index, field, value) => {
//     const updatedSales = [...editedSales];
//     if (updatedSales[index]) {
//         updatedSales[index][field] = value;
//         if (field === "sale_quantity") {
//             const sellingPrice = updatedSales[index]?.selling_price || 0;
//             updatedSales[index].sale_amount = value * sellingPrice;
//         }
//         setEditedSales(updatedSales);
//     }
// };

//   const handleSave = () => {
//     const updatedSales = [...sales];
//     editedSales.forEach((editedSale) => {
//         const saleIndex = updatedSales.findIndex(
//             (sale) => sale.cs_number === editedSale.cs_number && sale.id === editedSale.id
//         );
//         if (saleIndex !== -1) {
//             updatedSales[saleIndex] = { ...editedSale };
//         }
//     });
//     setSales(updatedSales);
//     setEditCsNumber(null);
// };
  // Group sales by date and then by cs_number
 
  const totalSalesAmount = filteredSales.reduce(
    (total, sale) => total + parseFloat(sale.sale_amount || 0),
    0
  );

  if (error) {
    return <h1>{error?.message || "An unknown error occurred"}</h1>;
  }

  if (!sales || sales.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f0' }}>
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
       <input
        type="text"
        placeholder="Search Products, Date, or Customer..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          backgroundColor: 'white',
          borderRadius: '5px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#d2b48c', color: '#654321' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Date</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Cs_number</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Customer Number</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #a0522d' }}>Details</th>
          </tr>
        </thead>
        <tbody>
    {Object.keys(groupedSales).map((date) =>
        groupedSales[date].map((sale) => (
            <tr key={`<span class="math-inline">\{date\}\-</span>{sale.cs_number}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{date}</td>
                <td style={{ padding: '8px' }}>{sale.cs_number}</td>
                <td style={{ padding: '8px' }}>{sale.customer_tel_no}</td>
                <td style={{ padding: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0e6d2' }}>
                                <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Product</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Amount</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editCsNumber === sale.cs_number ? (
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            value={editedSales.find(item => item.id === sale.id)?.product_name || ''}
                                            style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editedSales.find(item => item.id === sale.id)?.sale_amount || ''}
                                            style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editedSales.find(item => item.id === sale.id)?.sale_quantity || ''}
                                            style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px' }}
                                        />
                                    </td>
                                </tr>
                            ) : (
                                <tr key={sale.id}>
                                    <td style={{ padding: '8px' }}>{sale.product_name}</td>
                                    <td style={{ padding: '8px' }}>{sale.sale_amount}</td>
                                    <td style={{ padding: '8px' }}>{sale.sale_quantity}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </td>
             
            </tr>
        ))
    )}
</tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
              <strong>Total:</strong>
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
              <strong>Kshs.{totalSalesAmount.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default FetchingCashSales;
