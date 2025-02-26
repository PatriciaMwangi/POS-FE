import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchInventory } from "../redux/fetchInventory";
import { fetchedProducts } from "../redux/fetchAllProducts";
import './salesnewproduct.css'

const SalesNewProduct = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [sales, setSales] = useState([]);
  const [quantityTaken, setQuantityTaken] = useState("");
  const [isProductFound,setIsProductFound] = useState(false)
  const [showSuggestions,setShowSuggestions] = useState(false)
  const [debouncedName,setDebouncedName] = useState("")
  const [remainingInventory, setRemainingInventory] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [date, setDate] = useState("");
  const [editSale, setEditSale] = useState(null);
  const [saleAmount, setSaleAmount] = useState(0); 
  const [allProducts,setAllProducts] = useState([])
const [modalOpen,setModalOpen] = useState("")
const [change,setChange] = useState("")
const  [totalCash,setTotalCash] = useState("")

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("accessToken");
const customer_tel_no = localStorage.getItem("customer_tel_no")
console.log(customer_tel_no,'tek')
  const API_URL = "http://127.0.0.1:5000";
  const navigate = useNavigate();

  
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = storedUser?.is_admin === 1 || storedUser?.is_admin === "1";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchedProducts(0, token, API_URL);
        console.log("Raw Response:", response);
  
  
        if (response) {
          console.log(response.products,'app')
          setAllProducts(response.products);
        } else {
          setError("Failed to fetch product data");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError("Error fetching product data");
      }
    };
  
    fetchProducts();
  }, [token]);

  useEffect(() => {
    console.log(allProducts, 'ap');
  }, [allProducts]);
  
  
  const debounce = (func,delay) =>{
    let timer;
    return (...args) =>{
      clearTimeout(timer)
      timer = setTimeout(()=>func(...args),delay)
    }
  }

  const debouncedFetch = debounce(setDebouncedName, 500);

  useEffect(() => {
    if (debouncedName) {
      checkProductExists(debouncedName);
    }
  }, [debouncedName]);


  const checkProductExists = async (productName) => {
    const product = allProducts.find((product) =>
      product.name.toLowerCase().includes(productName.toLowerCase())
    );
    if (product) {
      setCode(product.code);
      setPrice(product.price_details?.[0].selling_price);
      setRemainingInventory(product.remaining_quantity);
      localStorage.setItem("pd",product.id)
      setIsProductFound(true)
      setError("");
    } else {
      setError("Product not found in the store");
      setCode("");
      setRemainingInventory("");
      setPrice("");
      setQuantityTaken("")
      setIsProductFound(false);
    }
  };
  
  const handleNameChange = async (e) => {
    const productName = e.target.value;
    setName(productName)
    setShowSuggestions(productName.trim().length > 0);

    if (productName) {
      debouncedFetch(productName);
    } else {
      setError("");
      setCode("");
      setPrice("");
      setRemainingInventory("");
      setQuantityTaken("");
      setDiscount("");
    }
  
  };

  const handleProductSelect = (productName) => {
    setName(productName);
setShowSuggestions(false)
    debouncedFetch(productName); // Trigger fetch on selecting the product
  };

  
  const handleQuantityTaken = (e) => {
    const inputValue = e.target.value;
  
    // Reset when the input is empty
    if (inputValue === "") {
      setError("");
      setQuantityTaken(""); // Clear the input
      setAmount(""); // Reset total amount
      return;
    }
  
    const inputQuantity = parseInt(inputValue, 10);
  
    if (isNaN(inputQuantity) || inputQuantity <= 0) {
      setError("Quantity must be a positive integer");
      setQuantityTaken(""); // Clear the input
      return;
    }
  
    if (remainingInventory && inputQuantity > remainingInventory) {
      setError("Quantity to be taken cannot exceed the remaining inventory");
      setQuantityTaken(""); // Clear the input
      return;
    }
  
    setError("");
    setQuantityTaken(inputQuantity);
  };
  

  useEffect(() => {
    const currentQuantity = quantityTaken || 1;

    if (isNaN(discount) || discount < 0 || discount > 100) {
      setError("Discount must be a number ranging from 0 to 100");
      setDiscount("")
      return; // Exit early if validation fails
    }
    const currentDiscount = discount || 0;
    if (price && currentQuantity) {
      const total = parseFloat(price) * parseFloat(currentQuantity);
      const discountedTotal = currentDiscount
        ? total - (total * parseFloat(currentDiscount)) / 100
        : total;
      setAmount(discountedTotal.toFixed(2));
    } else {
      setAmount("");
    }
  }, [price, quantityTaken, discount]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);


  const calculateTotalAmount = () => {
    const totalAmount = sales.reduce((acc, sale) => acc + sale.sale_amount, 0);
    setSaleAmount(totalAmount.toFixed(2)); // Update the total sale amount
  };

  const handleEditSale = (index) => {
    const sale = sales[index];
    setName(sale.product_name);
    setCode(sale.code);
    setPrice(sale.sale_amount / sale.sale_quantity);
    setQuantityTaken(sale.sale_quantity.toString());
    setDiscount(sale.sale_discount.toString());
    setAmount(sale.sale_amount.toString());
    setDate(sale.date);
    setEditSale(index);
  };

  const handleAddNewProduct = () => {
    const newSale = {
      sale_amount: parseFloat(amount),
      sale_quantity: quantityTaken ? parseFloat(quantityTaken) : 1,
      date,
      remainingInventory:remainingInventory,
      sale_discount: discount ? parseFloat(discount) : 0,
      customer_id: localStorage.getItem("customer_id"),
      customer_tel_no,
      user_id: userId,
      product_id: localStorage.getItem("pd"),
      product_name: name,
    };

    if (editSale !== null) {
      const updatedSales = [...sales];
      updatedSales[editSale] = newSale;
      setSales(updatedSales);
      console.log(sales,'sales')
      setEditSale(null);
    } else {
      setSales([newSale, ...sales]);
    }
    calculateTotalAmount(); // Recalculate total amount after adding/editing
    setAmount("");
    setCode("");
    setDiscount("");
    setName("");
    setPrice("");
    setQuantityTaken("");
    setRemainingInventory("");
  };

  const handleDelete = (index) => {
    const updatedSales = sales.filter((_, i) => i !== index);
    setSales(updatedSales);
    calculateTotalAmount(); // Recalculate total amount after deletion
  };

  const SubmitSales = async () => {
    try {
      const response = await fetch(`${API_URL}/cashsaledetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sales),
      });

      if (response.ok) {
        console.log("Cash sale submitted");
        navigate("/admin-dashboard");
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error || "Something went wrong"}`);
      }
    } catch (err) {
      setError(`Error: ${err.message || "An unexpected error occurred"}`);
    }
  };

  useEffect(() => {
    calculateTotalAmount(); // Recalculate total whenever sales change
  }, [sales]);
return(
  <div className="container" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
  <div className="row">
    <div className="col-md-6">
      <form style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        {error && <h5 className="text-danger">{error}</h5>}
        <div className="mb-3">
          <label style={{ color: '#555' }}>Date</label>
          <input type="text" className="form-control" value={date} readOnly style={{ backgroundColor: '#f0f0f0' }} />
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={handleNameChange}
            style={{ borderColor: '#ccc' }}
          />
          {showSuggestions && (
            <div className="suggestions-container" style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 10, width: '95%', maxHeight: '200px', overflowY: 'auto' }}>
              {allProducts
                .filter((product) => {
                  const productName = product.name || '';
                  const searchName = name ? String(name) : '';
                  if (searchName.length === 0) return false;
                  return (
                    typeof productName === 'string' &&
                    productName.toLowerCase().includes(searchName.toLowerCase())
                  );
                })
                .map((product, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleProductSelect(product.name)}
                    style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#333' }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
                  >
                    {product.name}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Code</label>
          <input type="text" className="form-control" value={code} readOnly style={{ backgroundColor: '#f0f0f0' }} />
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Price</label>
          <input type="text" className="form-control" value={price} readOnly style={{ backgroundColor: '#f0f0f0' }} />
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Remaining Inventory</label>
          <input
            type="text"
            className="form-control"
            value={remainingInventory}
            readOnly
            style={{ backgroundColor: '#f0f0f0' }}
          />
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Quantity Taken</label>
          <input
            type="text"
            className="form-control"
            value={quantityTaken}
            onChange={handleQuantityTaken}
            style={{ borderColor: '#ccc' }}
          />
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Discount (%)</label>
          <input
            type="text"
            className="form-control"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{ borderColor: '#ccc' }}
          />
        </div>
        <div className="mb-3">
          <label style={{ color: '#555' }}>Total Amount</label>
          <input type="text" className="form-control" value={amount} readOnly style={{ backgroundColor: '#f0f0f0' }} />
        </div>
        <button
          type="button"
          onClick={handleAddNewProduct}
          style={{ backgroundColor: '#A0522D', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {editSale !== null ? 'Update Sale' : 'Add Sale'}
        </button>

        {modalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
              <h3 style={{ color: '#A0522D' }}>Payment Details</h3>
              <p>Total Amount: {saleAmount}</p>
              <label style={{ display: 'block', marginBottom: '10px' }}>
                Balance:
                <input
                  type="number"
                  value={totalCash}
                  onChange={(e) => {
                    const cashGiven = parseFloat(e.target.value);
                    setTotalCash(cashGiven);

                    if (!isNaN(cashGiven) && cashGiven >= saleAmount) {
                      setChange((cashGiven - saleAmount).toFixed(2));
                      setError('');
                    } else {
                      setChange('');
                      setError('Insufficient cash given');
                    }
                  }}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
              {change && <p style={{ color: '#A0522D' }}>Change to Give: {change}</p>}
              {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={() => setModalOpen(false)} style={{ backgroundColor: '#ccc', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button
                  onClick={() => {
                    if (!error && totalCash >= amount) {
                      SubmitSales();
                      setModalOpen(false);
                    } else {
                      setError('Insufficient cash edit out list or pay up');
                      setModalOpen(false);
                    }
                  }}
                  style={{ backgroundColor: '#A0522D', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Confirm and Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
    <div className="col-md-6">
      <h3 style={{ color: '#A0522D' }}>CashSale List:</h3>
      <button type="button" onClick={() => setModalOpen(true)} style={{ backgroundColor: '#A0522D', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}>
        Done Shopping
      </button>
      <h4>Total Sale amount: {saleAmount}</h4>
      {sales.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Discount (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sale.product_name}</td>
                <td>{sale.sale_quantity}</td>
                <td>{sale.sale_amount.toFixed(2)}</td>
                <td>{sale.sale_discount}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => handleEditSale(index)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sales added yet.</p>
      )}
    </div>
  </div>
</div>
)
}
export default SalesNewProduct;
