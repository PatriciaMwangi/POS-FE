export const fetchedProduct = async (productId,token,API_URL) =>{
    try{
        const response = await  fetch(`${API_URL}/products/${productId}`,{
            headers:{
                Authorization : `Bearer ${token}`,
            }
        });
if (response.ok){
    return await response.json()
}else{
    const error = await response.json()
    throw new Error(error.msg)
}
    } catch (error){
throw new Error("Failed to fetch product details")
    }
}