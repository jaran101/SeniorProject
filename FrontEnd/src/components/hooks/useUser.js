import axios from "axios";
import { useEffect,useState } from "react";


export default function useUser() {
    
  const [loading, setLoading] = useState(true);
  const [profileUser,setProfileUser] = useState(null);
    useEffect(()=>{
        
        const user = localStorage.getItem('user');
        const idUser = JSON.parse(user)?.payload?.id;
        if(!idUser){
               setLoading(false);     
               return;
        }

        const loadProfile = async()=> {
            try {
                const response = await axios.get(`http://localhost:3000/api/readmyprofile/${idUser}`,
                    {
                        headers: { authorization: localStorage.getItem("token") },
                    });         
                setProfileUser(response.data.result)
                    
            }
            catch(error) {
                console.log(error?.response?.data?.message);
            }
            finally{
                                setLoading(false);
            }
        }
    loadProfile();
},[])
return {profileUser, loading}
}
