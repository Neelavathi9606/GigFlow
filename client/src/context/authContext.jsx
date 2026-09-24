import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [accessToken,  setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userInfo');

    if(token && userData){
      setAccessToken(token);
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, [])

  const login = (token, userData) => {
    console.log(`context login data: ${token} , ${userData}`);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));

    setAccessToken(token);
    setUser(userData);
    setIsLoggedIn(true);
  }

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');

    setAccessToken(null);
    setUser(null);
    setIsLoggedIn(false);
  }

  return(
    <AuthContext.Provider value={{user, isLoggedIn, accessToken, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
};

export default function useAuth(){
  return useContext(AuthContext);
}