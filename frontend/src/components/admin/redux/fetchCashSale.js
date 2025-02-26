export const fetchCashSale = async (token,API_URL) =>{
    try{
        const response = await  fetch(`${API_URL}/cashsaledetails`,{
            headers:{
                Authorization : `Bearer ${token}`,
                'Content-Type' :'application/json'
            }
        });
if (response.ok){
    console.log(response,'res')
    return await response.json()
}else{
    const error = await response.json()
    throw new Error(error.msg)
}
    } catch (error){
throw new Error("Failed to fetch product details")
    }
}