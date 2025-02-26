import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'; // Import the boxes icon

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [groupedPurchases, setGroupedPurchases] = useState({});
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const API_URL = "http://127.0.0.1:5000";
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPurchases = useMemo(() => {
    if (!groupedPurchases || Object.keys(groupedPurchases).length === 0) {
      return groupedPurchases; // Return the original if empty or not yet loaded
    }

    return Object.keys(groupedPurchases)
      .filter((date) => {
        if (!searchTerm) return true;
        if (date.toLowerCase().includes(searchTerm.toLowerCase())) return true;

        return Object.keys(groupedPurchases[date]).some((purchaseNo) => {
          const purchases = groupedPurchases[date][purchaseNo];
          return purchases.some((purchase) => {
            return (
              purchaseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              purchase.supplier_tel_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
              purchase.supplier_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
              purchase.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              purchase.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              purchase.amount.toString().includes(searchTerm) ||
              purchase.quantity.toString().includes(searchTerm)
            );
          });
        });
      })
      .reduce((obj, key) => {
        obj[key] = groupedPurchases[key];
        return obj;
      }, {});
  }, [searchTerm, groupedPurchases]); // Dependencies for useMemo

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch(`${API_URL}/purchasedetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPurchases(data);
          groupDataByDateAndPurchaseNo(data);
        } else {
          const errorData = await response.json();
          setError(`Error: ${errorData.msg}`);
        }
      } catch (error) {
        setError('Failed to fetch purchases');
      }
    };

    fetchPurchases();
  }, [API_URL, token]);

  const groupDataByDateAndPurchaseNo = (data) => {
    const grouped = data.reduce((acc, purchase) => {
      const date = new Date(purchase.date).toDateString();
      if (!acc[date]) acc[date] = {};
      if (!acc[date][purchase.purchase_no]) acc[date][purchase.purchase_no] = [];
      acc[date][purchase.purchase_no].push(purchase);
      return acc;
    }, {});
    setGroupedPurchases(grouped);
  };

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!purchases || purchases.length === 0) {
    return <h1>Loading...</h1>;
  }


  return (
    <div style={{ padding: "16px", backgroundColor: "#f8f5f0", color: "#5c4033", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", borderBottom: "2px solid #a0522d", paddingBottom: "10px" }}>Purchases List</h2>
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
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          padding: '8px',
          marginBottom: '10px',
          width: '100%',
          boxSizing: 'border-box',
          border: '1px solid #d2b48c',
          borderRadius: '4px',
        }}
      />
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          border: "1px solid #d2b48c", // Table border
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#d2b48c", color: "#5c4033" }}>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Date</th>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Purchase No</th>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Supplier Details</th>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Product Name</th>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Product Code</th>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Amount</th>
            <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(filteredPurchases).map((date) => {
            const purchasesByDate = filteredPurchases[date];
            return Object.keys(purchasesByDate).map((purchaseNo, dateIndex) => {
              const purchases = purchasesByDate[purchaseNo];
              return purchases.map((purchase, purchaseIndex) => (
                <tr key={`${date}-${purchaseNo}-${purchaseIndex}`} style={{ borderBottom: "1px solid #d2b48c" }}>
                  {dateIndex === 0 && purchaseIndex === 0 && (
                    <td
                      rowSpan={Object.keys(purchasesByDate).reduce(
                        (sum, key) => sum + purchasesByDate[key].length,
                        0
                      )}
                      style={{
                        padding: "8px",
                        border: "1px solid #d2b48c",
                        verticalAlign: "top",
                      }}
                    >
                      {date}
                    </td>
                  )}
                  {purchaseIndex === 0 && (
                    <td
                      rowSpan={purchases.length}
                      style={{
                        padding: "8px",
                        border: "1px solid #d2b48c",
                        verticalAlign: "top",
                      }}
                    >
                      {purchaseNo}
                    </td>
                  )}
                  {purchaseIndex === 0 && (
                    <td
                      rowSpan={purchases.length}
                      style={{
                        padding: "8px",
                        border: "1px solid #d2b48c",
                        verticalAlign: "top",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#a0522d" }}>Name:</strong> {purchase.supplier_name}
                      </div>
                      <div>
                        <strong style={{ color: "#a0522d" }}>Tel:</strong> {purchase.supplier_tel_no}
                      </div>
                      <div>
                        <strong style={{ color: "#a0522d" }}>Address:</strong> {purchase.supplier_address}
                      </div>
                    </td>
                  )}
                  <td style={{ padding: "8px", border: "1px solid #d2b48c" }}>{purchase.product_name}</td>
                  <td style={{ padding: "8px", border: "1px solid #d2b48c" }}>{purchase.product_code}</td>
                  <td style={{ padding: "8px", border: "1px solid #d2b48c" }}>{purchase.amount}</td>
                  <td style={{ padding: "8px", border: "1px solid #d2b48c" }}>{purchase.quantity}</td>
                </tr>
              ));
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Purchases;
