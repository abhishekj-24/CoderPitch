// import axios from "axios";

// const axiosClient = axios.create({
//     baseURL: 'http://localhost:3000',
//     withCredentials: true,          // add the cookies with domain so we can assure that user is autheticat 
//     headers:{
//         'Content-Type': 'application/json'
//     }
// });

// export default axiosClient

import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;