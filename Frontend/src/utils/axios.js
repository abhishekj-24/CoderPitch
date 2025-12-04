import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,          // add the cookies with domain so we can assure that user is autheticat 
    headers:{
        'Content-Type': 'application/json'
    }
});

export default axiosClient