import { useState } from "react"
import { useNavigate } from "react-router-dom"

 const Product = () =>{

  const [name,setName] = useState('')
  const [code,setCode] = useState('')
  const [error,setError] = useState('')
  const token = localStorage.getItem('accessToken')
  const navigate = useNavigate()

  const API_URL = 'http://127.0.0.1:5000';

  const handlePost = async (e) => {
e.preventDefault()

if (!name || !code) {
  setError('Name and Code must be provided');
  return;
}

setError('');

try {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${token}`
    },
    body: JSON.stringify({ name, code }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("product added:",data)
    localStorage.setItem('product_id',data.id)
    navigate('/new-customer')
    
   // dispatch(setUser({ user, isAdmin: user.is_admin }));

    
  } else {
    const errorData = await response.json();
    setError(`Error: ${errorData.msg}`);
  }
} catch (error) {
  setError('Failed to add project');
}
};

  

    return(
        <> 

        <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputName" class="col-form-label">Name</label>
    <div class="col-auto">
    <input type="text" 
    id="inputName" class="form-control"
     onChange={(e)=>setName(e.target.value)}/>
  </div>
  <div class="col-auto">
    <label for="inputCode" class="col-form-label">Code</label>
  </div>
  <div class="col-auto">
    <input type="text"
     id="inputCode"
     class="form-control" 
     aria-describedby="passwordHelpInline"
     onChange={(e)=>setCode(e.target.value)}/>
  </div>
  <div>
    <button type='submit' onClick={handlePost} >Add Customer Details</button>
  </div>
  </div>
</div>
        </>
    )
}

export default Product