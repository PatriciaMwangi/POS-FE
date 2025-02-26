export const fetchPrice = async (priceId,token,API_URL) => {
    try{
        const response = await fetch(`${API_URL}/prices/${priceId}`,{
            headers:{
                Authorization:`Bearer${token}`,
                'Content-Type':'application-json'
            },  
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