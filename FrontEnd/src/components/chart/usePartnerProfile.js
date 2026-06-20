import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api"
const getToken = () => localStorage.getItem("token")
const authHeaders = () => ({ headers: { authorization: getToken() } })


const usePartnerProfile = (partnerId) => {
    const [profile, setProfile]= useState(null)

    useEffect(() => {
        if(!partnerId) return;

        const fetchProfile = async () => {
            try {
                const response = await 
                axios.get(`${API_URL}/readprofile/${partnerId}`, 
                    authHeaders()
                )
                setProfile(response.data)
            }catch(error){
                console.error("Error fetching profile:", 
                    error.response?.data?.msg || error.message
                )
            }
        }
        fetchProfile()
    },[partnerId])
return profile
}
export default usePartnerProfile