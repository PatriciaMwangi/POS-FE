import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Price = () => {
  const [purchaseDetails, setPurchaseDetails] = useState([]); // Store purchase details
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const productId = localStorage.getItem("product_id");
  const API_URL = "http://127.0.0.1:5000"; // Base API URL
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (state?.price_details) {
      const details = state.price_details.map((detail) => ({
        ...detail,
        selling_price: detail.selling_price,
      }));
      setPurchaseDetails(details);
    } else {
      console.error("No purchase details received");
    }
  }, [state]);

  const handlePostPrice = async (id, saleType) => {
    const item = purchaseDetails.find((detail) => detail.id === id);
    const finalPrice = item.selling_price;

    if (!finalPrice) {
      setErrorMessage(`Please provide a valid price for item ${id}`);
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/prices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          product_id: productId,
          selling_price: finalPrice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Price posted successfully:", data);
        setSuccessMessage(`Price posted successfully for item ${id}`);
        setErrorMessage("");

        // Navigate based on the sale type
        if (saleType === "cash") {
          navigate("/cash-details", { state: { selling_price: data.selling_price } });
        } else if (saleType === "credit") {
          navigate("/add-credit-details", { state: { selling_price: data.selling_price } });
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error for item ${id}: ${errorData.msg}`);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Failed to post price:", error);
      setErrorMessage(`Failed to post price for item ${id}`);
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h1>Price Details</h1>
      {purchaseDetails.length > 0 ? (
        <ul>
          {purchaseDetails.map((purchase) => (
            <li key={purchase.id}>
              <p>Default Price: {purchase.selling_price}</p>
              <label htmlFor={`priceInput-${purchase.id}`}>Set Price:</label>
              <input
                type="number"
                id={`priceInput-${purchase.id}`}
                value={purchase.selling_price}
                placeholder={purchase.selling_price}
                readOnly
              />
              <button onClick={() => handlePostPrice(purchase.id, "cash")}>
                Cash Sale
              </button>
              <button onClick={() => handlePostPrice(purchase.id, "credit")}>
                Credit Sale
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No purchase details available</p>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Price;
