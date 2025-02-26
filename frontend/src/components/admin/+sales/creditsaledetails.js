import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchInventory } from "../redux/fetchInventory";
import { fetchedProducts } from "../redux/fetchAllProducts";

const AddCreditSaleDetails = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [sales, setSales] = useState([]);
  const [quantityTaken, setQuantityTaken] = useState("");
  const [remainingInventory, setRemainingInventory] = useState("");
  const [amount, setAmount] = useState("");
  const [balance,setBalance] = useState("")
  const [salesAmount,setSaleAmount] = useState("")
  const [totalBalance,setTotalBalance] = useState(0)
  const [amountPaid,setAmountPaid] = useState("")
  const [allProducts,setAllProducts] = useState("")
  const [discount, setDiscount] = useState("");
  const [debouncedName,setDebouncedName] = useState("")
  const [showSuggestions,setShowSuggestions] = useState("")
  const [date, setDate] = useState("");
  const [editSale,setEditSale] = useState(null)
  const [previousBalance,setPreviousBalance] = useState("")



  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("accessToken");
  const { state } = useLocation();
  const customer_tel_no = state?.customer_tel_no;

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

    const debounced = (func,delay) =>{
      let timer;
      clearTimeout(timer);
      return (...args)=>{
        timer = setTimeout(()=>func(...args,delay))
      }
    }
    const debouncesFetch = debounced(setDebouncedName,500)
   
    
    useEffect(()=>{
      if(debouncedName){
        checkProductExists(debouncedName)
      }
    },[debouncedName])
  const checkProductExists = async (productName) => {
   const product = allProducts.find((product)=>product.name.toLowerCase().includes(productName.toLowerCase()))

         if (product) {
 setError("")    
          return product;
      } else {
        setError("Product not found in the store");
        setCode("");
        setRemainingInventory("");
        setPrice("");
        setQuantityTaken("")
      }
    
  };

  const handleNameChange = async (e) => {
    const productName = e.target.value;
    setName(productName);
    setShowSuggestions(productName.trim().length > 0)

    if (productName) {
debouncesFetch(productName)
     
    } else {
      setCode("");
      setPrice("");
      setRemainingInventory("");
      setAmountPaid("")
      setQuantityTaken("")
      setError("")
    }
  };

  const handleProductSelect = (productName) => {
    const selectedProduct = allProducts.find((product)=>product.name.toLowerCase() === productName.toLowerCase())
    if(selectedProduct){
    setName(productName);
setShowSuggestions(false)
localStorage.setItem("PRODUCTID",selectedProduct.id)
setPrice(selectedProduct.price_details?.[0]?.selling_price || "");
setRemainingInventory(selectedProduct.remaining_quantity)
    debouncesFetch(productName); // Trigger fetch on selecting the product
  };}

  const handleQuantityTaken = (e) => {
    const inputValue = e.target.value;
    if (inputValue === ""){
      setError("")
      setQuantityTaken("")
      setAmount("")
      return;
    }

    const inputQuantity= parseInt(inputValue,10)

    if (isNaN(inputQuantity || inputQuantity <= 0)) {
      setError("Quantity must be a positive integer");
      setQuantityTaken("");
      return;
    }
    if (remainingInventory && inputQuantity > remainingInventory) {
      setError("Quantity to be taken cannot exceed the remaining inventory");
      setQuantityTaken("");
      return;
    }
    setError("");
    setQuantityTaken(inputQuantity);
  };

  useEffect(() => {
    const currentQuantity = quantityTaken || 1;
    const currentDiscount =  0;

    if (price && currentQuantity) {
      const total = parseFloat(price) * parseFloat(currentQuantity);
      setAmount(total)
    } else {
      setAmount("");
    }
  }, [price, quantityTaken, discount]);

  useEffect(()=>{
    const salesAmount = sales.reduce((acc,sale)=>sale.cs_amount+ acc,0)
    setSaleAmount(salesAmount.toFixed(2)) 
  })

  useEffect(() => {
    if (amountPaid && amount) {
      const balance = parseFloat(amount) - parseFloat(amountPaid);
  
      setBalance(balance);
     
    } else {
      setBalance("");
    }
  }, [amount, amountPaid]);

  
  
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);


  const handleAddNewProduct = () => {
    const newSale = {
      cs_amount: parseFloat(amountPaid),
      cs_quantity: quantityTaken ? parseFloat(quantityTaken) : 1,
      date,
      sale_discount: 0,
      customer_id:localStorage.getItem("customer_id"),
      customer_tel_no:localStorage.getItem("customer_tel_no"),
      user_id: userId,
      product_id: localStorage.getItem("PRODUCTID"),
      product_name:name,
      remainingInventory:remainingInventory
    };
    if (editSale !== null) {
      const updatedSales = [...sales];
      updatedSales[editSale] = newSale;
      setSales(updatedSales);
      const previousBalance = parseFloat(sales[editSale].cs_amount || 0); // Get the previous amountPaid for this sale
      const updatedBalance = parseFloat(newSale.cs_amount || 0); // Get the new amountPaid for this sale
console.log(previousBalance,'pb')
console.log(updatedBalance,'ub')       
setTotalBalance((prevBalance) => (prevBalance || 0) + (previousBalance - updatedBalance));

      console.log(sales,'sales')
      setEditSale(null);
    } else {
      setTotalBalance(prevBalance=>(prevBalance || 0) + balance)
      setPreviousBalance(amountPaid)
      console.log(previousBalance,'pb')
      setSales([newSale, ...sales]);
    }
    console.log(newSale,'newSale')
    setAmount("");
    setCode("");
    setDiscount("");
    setAmountPaid("")
    setName("");
    setPrice("");
    setQuantityTaken("");
    setRemainingInventory("");
  };

  const SubmitSales = async () => {
    try {
      // Wait for the fetch request to resolve
      const response = await fetch(`${API_URL}/creditsaledetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sales),
      });
  
      // Check if the response is successful
      if (response.ok) {
        console.log('Cash sale submitted');
        navigate('/admin-dashboard'); // Navigate after successful submission
      } else {
        // Handle errors by parsing the response
        const errorData = await response.json();
        setError(`Error: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (err) {
      // Handle network or other unexpected errors
      setError(`Error: ${err.message || 'An unexpected error occurred'}`);
    }
  };
  const handleEditSale = (index) => {
    const sale = sales[index];
    const selectedProduct = allProducts.find(
      (product) => product.name.toLowerCase() === sale.product_name.toLowerCase()
    );
    console.log(selectedProduct,'sp')
  
    if (selectedProduct) {
      setPrice(selectedProduct.price_details?.[0]?.selling_price || "");
      setRemainingInventory(selectedProduct.remaining_quantity-sale.cs_quantity);
    }
    setName(sale.product_name);
    setQuantityTaken(sale.cs_quantity);
    setAmount(sale.cs_quantity*(selectedProduct.price_details?.[0]?.selling_price || ""));
    setAmountPaid(sale.cs_amount)
    setDate(sale.date);
    setEditSale(index);
  };
    const handleDelete = (index) =>{
      const deletedSale = sales[index]
      const selectedProduct = allProducts.find((product)=>product.name.toLowerCase() === deletedSale.product_name.toLowerCase())
      console.log(selectedProduct,'sppp')
      if (selectedProduct){
        const originalprice = selectedProduct.price_details?.[0].selling_price * deletedSale.cs_quantity
        console.log(originalprice,'price')
        console.log(deletedSale,'dS')
        const deletedBalance = parseFloat(deletedSale.cs_amount || 0);
        const deletedSaleBalance = originalprice - deletedBalance
        console.log(balance,'nn') // Get the amount of the deleted sale
        setTotalBalance(prevBalance => (prevBalance || 0) - deletedSaleBalance)
      
      
    const updatedSales = sales.filter((_,i)=> i !== index )
    console.log(totalBalance,'tb')
    console.log(deletedBalance,'deletedb')
    setSales(updatedSales)
  }
    }
  return(
  <div className="container" style={{ backgroundColor: '#f8f5f0', padding: '20px' }}> {/* Light brown background */}
  <div className="row">
    <div className="col-md-6">
      <form style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}> {/* White form background */}
        {error && <h5 className="text-danger">{error}</h5>}
        <div className="mb-2">
          <label style={{ color: '#8b4513' }}>Date</label> {/* Brown label */}
          <input type="text" className="form-control" value={date} readOnly style={{ borderColor: '#d2b48c' }} /> {/* Brown border */}
        </div>
        <div className="mb-2">
          <label style={{ color: '#8b4513' }}>Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={handleNameChange}
            style={{ borderColor: '#d2b48c' }}
          />
          {showSuggestions && (
            <div className="suggestions-container" style={{ backgroundColor: 'white', border: '1px solid #d2b48c', marginTop: '5px', borderRadius: '4px' }}> {/* Brown border for suggestions */}
              {allProducts
                .filter((product) => {
                  const productName = product.name || "";
                  const searchName = name ? String(name) : "";
                  if (searchName.length === 0) return false;
                  return (
                    typeof productName === "string" &&
                    productName.toLowerCase().includes(searchName.toLowerCase())
                  );
                })
                .map((product, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleProductSelect(product.name)}
                    style={{ padding: '8px', cursor: 'pointer', borderBottom: index < allProducts.filter((product) => {
                      const productName = product.name || "";
                      const searchName = name ? String(name) : "";
                      if (searchName.length === 0) return false;
                      return (
                        typeof productName === "string" &&
                        productName.toLowerCase().includes(searchName.toLowerCase())
                      );
                    }).length -1 ? '1px solid #d2b48c' : 'none' }} // Brown border between suggestions
                  >
                    {product.name}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="mb-2">
          <label style={{ color: '#8b4513' }}>Price</label>
          <input type="text" className="form-control" value={price} readOnly style={{ borderColor: '#d2b48c' }} />
        </div>
        <div className="mb-2">
          <label style={{ color: '#8b4513' }}>Remaining Inventory</label>
          <input
            type="text"
            className="form-control"
            value={remainingInventory}
            readOnly
            style={{ borderColor: '#d2b48c' }}
          />
        </div>
        <div className="mb-2">
          <label style={{ color: '#8b4513' }}>Quantity Taken</label>
          <input
            type="text"
            className="form-control"
            value={quantityTaken}
            onChange={handleQuantityTaken}
            style={{ borderColor: '#d2b48c' }}
          />
        </div>
        <div className="mb-3">
          <label style={{ color: '#8b4513' }}>Amount Paid</label>
          <input
            type="text"
            className="form-control"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            style={{ borderColor: '#d2b48c' }}
          />
        </div>
        <div className="mb-2">
          <label style={{ color: '#8b4513' }}>Balance</label>
          <input
            type="text"
            className="form-control"
            value={balance}
            readOnly
            style={{ borderColor: '#d2b48c' }}
          />
        </div>
        <div className="mb-3">
          <label style={{ color: '#8b4513' }}>Total Amount</label>
          <input type="text" className="form-control" value={amount} readOnly style={{ borderColor: '#d2b48c' }} />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAddNewProduct} style={{ backgroundColor: '#8b4513', borderColor: '#8b4513' }}> {/* Dark brown button */}
          {editSale !== null ? 'Update Sale' : "Add Sale"}
        </button>
      </form>
    </div>
    <div className="col-md-6">
      <h3 style={{ color: '#8b4513' }}>CreditSale List:</h3> {/* Brown heading */}
      <button type="button" className="btn btn-primary" onClick={SubmitSales} style={{ backgroundColor: '#8b4513', borderColor: '#8b4513' }}>
        Submit Sales
      </button>
      <h5 style={{ color: '#8b4513' }}>Total Balance: {totalBalance}</h5>
      <h5 style={{ color: '#8b4513' }}>Total Amount owed: {salesAmount}</h5>
      {sales.length > 0 ? (
        <table className="table table-bordered" style={{ borderColor: '#d2b48c' }}> {/* Brown table border */}
          <thead>
            <tr style={{ backgroundColor: '#d2b48c', color: 'white' }}> {/* Brown header row */}
              <th>#</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Amount Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sale.product_name}</td>
                <td>{sale.cs_quantity}</td>
                <td>{sale.cs_amount}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() => handleEditSale(index)}
                    style={{ backgroundColor: "#784e17", borderColor: '#d2b48c', color: 'white' }} // Brown edit button
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                    style={{ backgroundColor: '#8b4513', borderColor: '#8b4513', color: 'white' }} // Dark brown delete button
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
</div>)}

export default AddCreditSaleDetails;
