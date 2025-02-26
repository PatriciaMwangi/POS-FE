import { createContext, useContext, useState, useEffect } from "react";

 const UserContext = createContext()

 export const UserDetails = ({children}) =>{
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      });
      
      useEffect(() => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      }, [user]);
      
    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
 }

 export const useUserContext = () =>useContext(UserContext)