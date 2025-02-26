//  const handleDelete = async (productId) => {
//     try {
//       const response = await fetch(`${API_URL}/products/${productId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (response.ok) {
//         // Update state to remove the deleted product
//         setProducts((prevProducts) =>
//           prevProducts.filter((product) => product.id !== productId)
//         );
//         setAllProducts((prevAllProducts) =>
//           prevAllProducts.filter((product) => product.id !== productId)
//         );
//         setFilteredProducts((prevFilteredProducts) =>
//           prevFilteredProducts.filter((product) => product.id !== productId)
//         );
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to delete product");
//       }
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       setError("An error occurred while trying to delete the product.");
//     }
//   };
  