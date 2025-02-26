import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'; // Import the icon


export const CreditSaleProduct = () => {
  const API_URL = 'http://127.0.0.1:5000';
  const { state } = useLocation();
  const groupedSales = state?.groupedSales;
  const [modalData, setModalData] = useState(null); // For modal state
  const [updatedSales, setUpdatedSales] = useState(groupedSales); // Local state to handle updates
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [adminVerificationError, setAdminVerificationError] = useState('');
  const navigate = useNavigate()

  const handleUpdateWithPassword = async () => {
    setShowPasswordModal(true);
};

const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setAdminVerificationError('');

    try {
        const response = await fetch(`${API_URL}/verify-admin`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setShowPasswordModal(false);
            setPassword('');
            handleUpdate(); // Call handleUpdate without passing event
        } else {
            const data = await response.json();
            setAdminVerificationError(data.msg || 'Password verification failed.');
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        setAdminVerificationError('An error occurred during verification.');
    }
};

const handleModalOpen = (sale) => {
    setModalData(sale);
    console.log(sale, 'sale');
};

const handleModalClose = () => {
    setModalData(null);
};

const handleUpdate = async () => { // Removed 'event' parameter
    // Removed event.preventDefault();

    try {
        const response = await fetch(`${API_URL}/creditsaledetails/${modalData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cs_amount: modalData.updatedAmount, // Use modalData.updatedAmount
            }),
        });

        if (response.ok) {
            setUpdatedSales((prevSales) =>
                Object.entries(prevSales).reduce((acc, [csNumber, sales]) => {
                    acc[csNumber] = sales.map((sale) =>
                        sale.id === modalData.id
                            ? { ...sale, sale_amount: modalData.updatedAmount }
                            : sale
                    );
                    return acc;
                }, {})
            );

            handleModalClose();
        } else {
            console.error("Failed to update sale");
        }
    } catch (error) {
        console.error("Error updating sale:", error);
    }
};

if (!updatedSales) {
    return <p>No sales data available</p>;
}



  return (
    <div style={{ padding: "16px", backgroundColor: '#f8f5f0' }}> {/* Light brown background */}
    <div>
      <button
        className="btn btn-secondary"
        onClick={() => navigate('/creditsales')}
        style={{
          backgroundColor: '#d2b48c',
          borderColor: '#d2b48c',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: '8px' }} /> {/* Add the icon */}
        Credit Sales
      </button>
    </div><br/>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        backgroundColor: "white", // White background for the table
        border: "1px solid #d2b48c" // Brown border for the table
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#d2b48c", color: "white" }}> {/* Brown header row with white text */}
          <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Credit Sale Number</th>
          <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Customer Name</th>
          <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Product Name</th>
          <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Amount Paid</th>
          <th style={{ padding: "8px", border: "1px solid #d2b48c" }}>Balance</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(updatedSales).map(([csNumber, sales]) => (
          Array.isArray(sales) ? (
            <React.Fragment key={csNumber}>
              {sales.map((sale, index) => (
                <tr key={`${csNumber}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={sales.length} style={{ padding: "8px", border: "1px solid #d2b48c", verticalAlign: "top" }}>
                      {csNumber}
                    </td>
                  )}
                  {index === 0 && (
                    <td rowSpan={sales.length} style={{ padding: "8px", border: "1px solid #d2b48c", verticalAlign: "top" }}>
                      {sale.customer_name}
                    </td>
                  )}
                  <td style={{ padding: "8px", border: "1px solid #d2b48c" }}>{sale.product_name}</td>
                  <td
                    style={{ padding: "8px", border: "1px solid #d2b48c", cursor: "pointer", color: "#8b4513" }} // Dark brown clickable amount
                    onClick={() => handleModalOpen(sale)}
                  >
                    {sale.sale_amount}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #d2b48c" }}>
                    {(parseFloat(sale.selling_price) - parseFloat(sale.sale_amount)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ) : (
            <tr key={csNumber}>
              <td colSpan="5" style={{ padding: "8px", border: "1px solid #d2b48c" }}>
                No sales data for credit sale number {csNumber}.
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  
   {/* Modal */}
{modalData && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      zIndex: 1000,
      border: '2px solid #8b4513' // Dark brown modal border
    }}
  >
    <h3 style={{ color: '#8b4513' }}>Update Amount Paid</h3> {/* Brown modal heading */}
    <div>
      <label style={{ color: '#8b4513' }}> {/* Brown label */}
        Amount Paid:
        <input
          type="number"
          name="amount"
          defaultValue={modalData.sale_amount}
          required
          onChange={(e) => setModalData({ ...modalData, updatedAmount: e.target.value })}
          style={{ marginLeft: "8px", padding: "4px", borderColor: '#d2b48c' }} // Brown input border
        />
      </label>
    </div>
    <div style={{ marginTop: "16px" }}>
      <button
        type="button" // Change to type button so the form does not submit when in a form.
        onClick={handleUpdateWithPassword}
        style={{
          marginRight: "8px",
          backgroundColor: '#8b4513',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
        }}
      >
        Update
      </button>
      <button
        type="button"
        onClick={handleModalClose}
        style={{ backgroundColor: '#d2b48c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
      >
        Cancel
      </button>
    </div>

    {/* Password Verification Modal */}
    {showPasswordModal && (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1001,
        }}
      >
        <h3>Verify Admin Password</h3>
        <form onSubmit={handlePasswordSubmit}>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginLeft: '8px', padding: '4px' }}
              />
            </label>
          </div>
          {adminVerificationError && (
            <p style={{ color: 'red' }}>{adminVerificationError}</p>
          )}
          <div style={{ marginTop: '16px' }}>
            <button type="submit">Verify</button>
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              style={{ marginLeft: '8px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    {showPasswordModal && (
      <div
        onClick={() => setShowPasswordModal(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      ></div>
    )}
  </div>
)}

{/* Overlay */}
{modalData && (
  <div
    onClick={handleModalClose}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    }}
  ></div>
)}

  </div>
  );
};
