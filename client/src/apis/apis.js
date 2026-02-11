import { toast } from '@heroui/theme';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const baseURL = 'http://localhost:5000/api/v1';

export const customAxios = axios.create({ baseURL });



customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        if (status === 403 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await generateRefreshToken();
                return customAxios(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
            }
        }

    return Promise.reject(error)
}
)

export const login = async (userInputs, setUserInputs) => {

    const navigate = useNavigate();

   try{
        const response = await customAxios.post('/auth/login', 
            {email: userInputs.email, password: userInputs.password}, 
            { withCredentials: true });

        const {data} = response;

        const id = data?.user?.id;

        if(id.status === 200){
            window.location.assign(`/dashboard/${id}`);
        }
    }catch (error) {
        console.log(error)
    }finally{
        setUserInputs({email: '', password: ''});
    }
}

export const signup = async (userInputs, setUserInputs) => {
    try {
        const response = await customAxios.post('/auth/signup',
            {username: userInputs.username, email: userInputs.email, password: userInputs.password},
            {withCredentials:true}
        )

        const {data} = response;

        const id = data?.user?.id;

        if(id.status === 201){
            window.location.assign(`/login`);
        }
    } catch (error)  {
        console.log(error)
    }finally{
        setUserInputs({username: '', email: '', password: ''});
        }
}

const generateRefreshToken = async () => {
    try{
        await customAxios.post('/auth/refresh-token', {}, { withCredentials: true });
    }catch (error) {
        console.log(error)
    }
}