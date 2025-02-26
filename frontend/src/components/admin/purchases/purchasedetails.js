import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPurchaseDetails } from '../redux/fetchPurchaseDetails';

export const PurchaseDetails = () => {
  const { purchaseid } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');
  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchedPurchaseDetails = async () => {
      try {
        const data = await fetchPurchaseDetails(purchaseid,token,API_URL)
          console.log(data)
          setPurchase(data)
          
        }  catch (error) {
        setError('Failed to fetch purchase details');
      }
    };
    fetchedPurchaseDetails();
  }, [purchaseid, token]);

  
  if (error) {
    return <h1>{error}</h1>;
  }

  if (!purchase) {
    return <h1>Loading...</h1>;
  }

    return(
        <> 
<div class="card text-center">
  <div class="card-header">
    Purchase Details
  </div>
  <div class="card-body">
  <ul class="list-group list-group-flush">
  Amount
    <li class="list-group-item">{purchase.amount}</li>
    Quantity
    <li class="list-group-item">{purchase.quantity}</li>
    Date
    <li class="list-group-item">{purchase.date}</li>


  </ul>
    <p class="card-text"></p>
    <div>
    < a href = {`/edit-purchase/${purchaseid}`} className="btn btn-primary mt-3">Edit</a> 
  </div>
    <a href="/purchases" class="btn btn-primary">Back</a> 
    <a href={`/productdetails/${purchase.purchase_no}`} class="btn btn-primary">Product Details</a>
    <a href={`/supplierdetails/${purchase.purchase_no}`} class="btn btn-primary">Supplier details</a>


  </div>
  
</div>


        </>
    )
}

