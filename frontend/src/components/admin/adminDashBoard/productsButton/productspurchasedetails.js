import { fetchPurchaseDetails } from "../../redux/fetchPurchaseDetails";
import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";


const ProductPurchaseDetails = () => {
  const [purchasedetails, setPurchaseDetails] = useState(null);
  const [error, setError] = useState(null);
  const { purchaseId } = useParams(); // Extract purchaseId from the URL
  const API_URL = "http://127.0.0.1:5000";
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchPurchaseDetails(purchaseId, token, API_URL);
        setPurchaseDetails(response);
        console.log(response);
      } catch (err) {
        console.error("Error fetching purchase details:", err);
        setError("Failed to fetch purchase details.");
      }
    };

    if (purchaseId) {
      fetchDetails();
    }
  }, [purchaseId, token, API_URL]);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!purchasedetails) {
    return <h1>Loading purchase details...</h1>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Purchase Details</h2>
        <p>
          <strong>Purchase Date:</strong>{" "}
          {new Date(purchasedetails.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Product Name:</strong> {purchasedetails.product_name}
        </p>
        <p>
          <strong>Supplier Name:</strong> {purchasedetails.supplier_name}
        </p>
        <p>
          <strong>Quantity:</strong> {purchasedetails.quantity}
        </p>
        <button onClick={()=>navigate('/products')}>
          Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    margin: "0 auto",
    padding: "20px",
    maxWidth: "500px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  cardTitle: {
    marginBottom: "20px",
    color: "#333",
  },
};

export default ProductPurchaseDetails;
