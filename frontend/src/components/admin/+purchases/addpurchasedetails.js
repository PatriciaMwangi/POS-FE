import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faCheck, faTimes, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';


const AddPurchaseDetails = () => {
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [amount, setAmount] = useState('');
  const [totalCash,setTotalCash] =useState("")
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [amoun, setAmoun] = useState('');
  const [purchases, setPurchases] = useState([]); // Store multiple purchases
  const [editSale,setEditSale] = useState(null)
  const [purchaseSale,setPurchaseSale] = useState(0)
  const token = localStorage.getItem('accessToken');
  const supplier_id = localStorage.getItem('supplier_id');
  const user_id = localStorage.getItem('user_id');
  const [modalOpen,setModalOpen] = useState("")
  const [change,setChange] = useState("")

  const navigate = useNavigate();
  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  useEffect(() => {
    if (isNaN(amoun) || amoun < 0) {
      setError('Product price must be a positive integer.');
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      setError('Product quantity must be a positive integer.');
      return;
    }
    if (amoun && quantity) {
      const total = parseFloat(amoun) * parseFloat(quantity);
      setAmount(total.toFixed(2));
    } else {
      setAmount('');
    }
  }, [amoun, quantity]);

  //adding new purchases and editting existing ones

  const handleAddPurchase = () => {
    if (!productName || !amount || !quantity || !supplier_id) {
      setError('Please fill in all fields before adding a purchase.');
      return;
    }

    const newPurchase = {
      productName,
      amount: parseFloat(amount),
      quantity: parseInt(quantity, 10),
      date,
      supplier_id,
      user_id, 
    };
if (editSale !== null){
  setPurchases((prevPurchases) =>
    prevPurchases.map((purchase, index) =>
      index === editSale ? newPurchase : purchase
    )
  );
}else{
  setPurchases((prevPurchases) => [...prevPurchases, newPurchase]); // Append to the array
  console.log(purchases,'p')
  
}
setEditSale(null)
 setProductName('');
setAmount('');
setAmoun('')
setQuantity('');
setError('');
  };

  useEffect(() => {
    console.log('Updated Purchases:', purchases);
  }, [purchases]);

  useEffect(() => {
    const sum = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
    setPurchaseSale(parseFloat(sum.toFixed(2)));
  }, [purchases]); // ✅ Runs automatically when `purchases` updates
  

  const handleEdit = (index) =>{
    const purchase = purchases[index]
    setProductName(purchase.productName)
    setAmount(purchase.amount) 
    setQuantity(purchase.quantity)
    setAmoun(purchase.amount/purchase.quantity)
    setEditSale(index)
      }

 const handleDelete = (index) =>{
  const updatedPurchases = purchases.filter((_,i)=> i !==index)
  setPurchases(updatedPurchases)
 }

  const handleSubmitPurchases = async () => {
    if (purchases.length === 0) {
      setError('No purchases to submit.');
      return;
    }
  
    setError('');
  
    try {

      const invalidPurchases = purchases.filter(
        (purchase) =>
          !purchase.productName || !purchase.amount || !purchase.quantity || !purchase.date
      );
  
      if (invalidPurchases.length > 0) {
        setError('Some purchases are missing required details.');
        return;
      }
  
      // Step 1: Extract product names for the batch product POST
      const productPayload = purchases.map((purchase) => ({ 
        name: purchase.productName
        
      }));
      console.log(productPayload,'payload prouct')
  
      const productResponse = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload), // Batch POST the products
      });
  
      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        setError(`Error adding products: ${errorData.msg}`);
        return;
      }
  
      const productData = await productResponse.json()
      console.log(productData,'produtcData'); // Assume this returns an array of created product IDs
      if (!Array.isArray(productData) || productData.some(p => !p.id)) {
        setError('Invalid response from product API');
        console.log('Invalid product data:', productData);
        return;
      }
      
  
      // Step 2: Create purchase details payload by mapping product IDs
      const purchaseDetailsPayload = purchases.map((purchase, index) => ({
        amount: purchase.amount,
        quantity: purchase.quantity,
        date: purchase.date,
        supplier_id: purchase.supplier_id,
        userId: purchase.user_id,
        product_id: productData[index].id, // Map the returned product ID
      }));

  console.log(purchaseDetailsPayload,'payload')
  
      const purchaseDetailsResponse = await fetch(`${API_URL}/purchasedetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(purchaseDetailsPayload), // Batch POST the purchase details
      });
  
      if (!purchaseDetailsResponse.ok) {
        const errorData = await purchaseDetailsResponse.json();
        setError(`Error adding purchase details: ${errorData.msg}`);
        return;
      }
      console.log(purchases,'purchases2')

      // Success: Clear all purchases and navigate
      setPurchases([]);
      console.log('All purchases submitted successfully.');
      navigate('/admin-dashboard');
    } catch (error) {
      setError('An unexpected error occurred while adding purchases.');
    }
  };
  
  
  return (
    <>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3">
            {error && <h1 className="text-danger">{error}</h1>}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label htmlFor="inputProductName" className="form-label">Product Name</label>
                <input type="text" id="inputProductName" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="inputAmount" className="form-label">Amount for Single Item</label>
                <input type="text" id="inputAmount" className="form-control" value={amoun} onChange={(e) => setAmoun(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="inputQuantity" className="form-label">Quantity</label>
                <input type="text" id="inputQuantity" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="inputDate" className="form-label">Date</label>
                <input type="text" id="inputDate" className="form-control" readOnly value={date} />
              </div>
              <div className="mb-3">
                <label htmlFor="inputTotalAmount" className="form-label">Total Amount</label>
                <input type="text" id="inputTotalAmount" className="form-control" readOnly value={parseFloat(amoun) * parseInt(quantity)} />
              </div>
              <div>
                <button type="button" className="btn btn-primary me-2" onClick={handleAddPurchase}>
                  {editSale === null ? <><FontAwesomeIcon icon={faPlus} className="me-1" /> Add Purchase</> : <><FontAwesomeIcon icon={faEdit} className="me-1" /> Update Purchase</>}
                </button>
                <button type="button" className="btn btn-success" onClick={() => setModalOpen(true)}>
                  <FontAwesomeIcon icon={faMoneyBillWave} className="me-1" /> Submit Purchase Details
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3">
            <h3>Purchase List:</h3>
            <h4>Total Purchase amount: {typeof purchaseSale === 'number' ? purchaseSale.toFixed(2) : '0.00'}</h4>
            {purchases.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{purchase.productName}</td>
                      <td>{purchase.quantity}</td>
                      <td>{purchase.amount.toFixed(2)}</td>
                      <td>
                        <button type="button" className="btn btn-secondary btn-sm me-2" onClick={() => handleEdit(index)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>
                          <FontAwesomeIcon icon={faTrash} />
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

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Payment Details</h3>
            <p>Total Amount: {typeof purchaseSale === 'number' ? purchaseSale.toFixed(2) : '0.00'}</p>
            <label>
              Balance:
              <input type="number" value={totalCash} onChange={(e) => {
                const cashGiven = parseFloat(e.target.value);
                setTotalCash(cashGiven);

                if (!isNaN(cashGiven) && cashGiven >= purchaseSale) {
                  setChange((cashGiven - purchaseSale).toFixed(2));
                  setError("");
                } else {
                  setChange("");
                  setError("Insufficient cash given");
                }
              }} />
            </label>
            {change && <p>Change to Give: {change}</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="modal-actions">
              <button className="btn btn-secondary me-2" onClick={() => setModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} className="me-1"/> Cancel
              </button>
              <button className="btn btn-primary" onClick={() => {
                if (!error && totalCash >= purchaseSale) {
                  handleSubmitPurchases();
                  setModalOpen(false);
                } else {
                  setError("Please enter sufficient cash to proceed.");
                }
              }}>
                <FontAwesomeIcon icon={faCheck} className="me-1"/> Confirm and Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPurchaseDetails;
