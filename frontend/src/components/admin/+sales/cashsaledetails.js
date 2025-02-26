import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchInventory } from "../redux/fetchInventory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillAlt,
  faBoxes,
  faShoppingCart,
  faCalculator,
  faPercent,
  faCalendarAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';


const AddCashSaleDetails = () => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [date, setDate] = useState("");
  const [remainingInventory, setRemainingInventory] = useState(""); 
  const [error, setError] = useState("");

  const { state } = useLocation();
  const sellingPrice = state?.selling_price;

  const token = localStorage.getItem("accessToken");
  const productId = localStorage.getItem("product_id");
  const customer_tel_no = localStorage.getItem("customer_tel_no");
  const userId = localStorage.getItem("user_id");

  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:5000";

  // Initialize the current date and price
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
    setPrice(sellingPrice);
  }, [sellingPrice]);

  // Fetch remaining inventory
  useEffect(() => {
    const fetchedInventory = async () => {
      try {
        const response = await fetchInventory(token,API_URL,productId)
        setRemainingInventory(response.remaining_quantity)
          console.log(response,'inventory')
       
        }
      catch (err) {
        setError("Error fetching inventory data.");
      }
    };

    if (productId) {
      fetchedInventory();
    }
  }, [productId]);

  // Auto-calculate the total amount
  useEffect(() => {
    if (price && quantity) {
      const total = parseFloat(price) * parseFloat(quantity);
      const discountedTotal = discount
        ? total - (total * parseFloat(discount)) / 100
        : total;
      setAmount(discountedTotal.toFixed(2));
    } else {
      setAmount("");
    }
  }, [price, quantity, discount]);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!price || !quantity || isNaN(price) || isNaN(quantity)) {
      setError("Price and Quantity must be valid numbers.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/cashsaledetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sale_amount: parseFloat(amount),
          sale_quantity: parseFloat(quantity),
          date,
          sale_discount: discount ? parseFloat(discount) : 0,
          customer_tel_no,
          user_id: userId,
          product_id: productId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cash sale details added:", data);
        navigate("/admin-dashboard");
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.msg || "Failed to add cash sale details"}`);
      }
    } catch (error) {
      setError("Failed to include cash sale details. Check your connection.");
    }
  };

  return (
    <form onSubmit={handlePost} style={{ backgroundColor: '#f8f0e3', padding: '20px', borderRadius: '8px' }}>
      {error && (
        <div className="alert alert-danger" style={{ backgroundColor: '#a0522d', color: 'white', borderColor: '#a0522d' }}>
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="inputPrice" className="form-label" style={{ color: '#6b3e26' }}>
          <FontAwesomeIcon icon={faMoneyBillAlt} className="me-2" style={{ color: '#6b3e26' }} />
          Price
        </label>
        <input
          type="text"
          id="inputPrice"
          className="form-control"
          placeholder="Enter price"
          value={price}
          readOnly
          style={{ borderColor: '#6b3e26' }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inputInventory" className="form-label" style={{ color: '#6b3e26' }}>
          <FontAwesomeIcon icon={faBoxes} className="me-2" style={{ color: '#6b3e26' }} />
          Remaining Inventory
        </label>
        <input
          type="text"
          id="inputInventory"
          className="form-control"
          value={remainingInventory}
          readOnly
          style={{ borderColor: '#6b3e26' }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inputQuantity" className="form-label" style={{ color: '#6b3e26' }}>
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" style={{ color: '#6b3e26' }} />
          Quantity
        </label>
        <input
          type="text"
          id="inputQuantity"
          className="form-control"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ borderColor: '#6b3e26' }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inputAmount" className="form-label" style={{ color: '#6b3e26' }}>
          <FontAwesomeIcon icon={faCalculator} className="me-2" style={{ color: '#6b3e26' }} />
          Amount
        </label>
        <input
          type="text"
          id="inputAmount"
          className="form-control"
          placeholder="Total amount"
          value={amount}
          readOnly
          style={{ borderColor: '#6b3e26' }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inputDiscount" className="form-label" style={{ color: '#6b3e26' }}>
          <FontAwesomeIcon icon={faPercent} className="me-2" style={{ color: '#6b3e26' }} />
          Discount (%)
        </label>
        <input
          type="text"
          id="inputDiscount"
          className="form-control"
          placeholder="Enter discount (optional)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          style={{ borderColor: '#6b3e26' }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inputDate" className="form-label" style={{ color: '#6b3e26' }}>
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" style={{ color: '#6b3e26' }} />
          Date
        </label>
        <input
          type="text"
          id="inputDate"
          className="form-control"
          value={date}
          readOnly
          style={{ borderColor: '#6b3e26' }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ backgroundColor: '#6b3e26', borderColor: '#6b3e26' }}
      >
        <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
        Submit
      </button>
    </form>
  );
};

export default AddCashSaleDetails;
