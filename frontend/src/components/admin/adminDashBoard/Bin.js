import { useState, useEffect } from "react";
const Bin = () =>{
    const [DeletedProducts,setDeletedProducts] = useState("")
    
    useEffect(() => {
        fetch("http://127.0.0.1:5000/deleted-products")
          .then((res) => res.json())
          .then((data) => setDeletedProducts(data))
          .catch((err) => console.error("Error fetching deleted products:", err));
      }, []);
return(
    <>
    <h1>Deleted Products</h1>
    </>
)      
}
export default Bin