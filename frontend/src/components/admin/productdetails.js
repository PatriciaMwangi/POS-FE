import { useEffect, useState, Link } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { purchaseid } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');
  const API_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/purchasedetails/${purchaseid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setPurchase(data);
        } else {
          const errorData = await response.json();
          setError(`Error: ${errorData.msg}`);
        }
      } catch (error) {
        setError('Failed to fetch purchase details');
      }
    };
    fetchPurchaseDetails();
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
    Product Details
  </div>
  <div class="card-body">
  <ul class="list-group list-group-flush">
  name
    <li class="list-group-item">{purchase.product_name}</li>
    code
    <li class="list-group-item">{purchase.product_code}</li>
    


  </ul>
    <p class="card-text"></p>
     
    <a href={`/purchasedetails/${purchase.purchase_no}`} class="btn btn-primary">Back</a> 
    <a href="/purchases" class="btn btn-primary">Purchase List</a>
    <a href="/admin-dashboard" class="btn btn-primary">Dashboard</a>


  </div>
  
</div>


        </>
    )
}

export default ProductDetails

