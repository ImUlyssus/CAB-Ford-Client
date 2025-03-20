import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        const newAccessToken = response.data.accessToken;
        
        // Ensure that we only update the access token, not the email
        setAuth(prev => {
            const updatedAuth = { ...prev, accessToken: newAccessToken };
            // Do not store the whole auth object in localStorage, just the email
            if (prev?.email) {
                localStorage.setItem('authEmail', prev.email);
            }
            return updatedAuth;
        });
        return newAccessToken;
    }
    
    return refresh;
};

export default useRefreshToken;

// const useRefreshToken = () => {
//     const { setAuth } = useAuth();

//     const refresh = async () => {
//         const response = await axios.get('/refresh', {
//             withCredentials: true
//         });
//         setAuth(prev => {
//             return { ...prev, accessToken: response.data.accessToken }
//         });
//         return response.data.accessToken;
//     }
//     return refresh;
// };
