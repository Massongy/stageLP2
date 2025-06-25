import { useEffect, useState } from "react";
 
export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  
 
 
  useEffect(() => {
    const token = localStorage.getItem("access");
    
    if (!token) return;
 
    fetch("/api/users/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, []);
  return user;

}