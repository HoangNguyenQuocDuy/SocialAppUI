import axios from "axios"
import { fetchRefreshToken } from "~/store/slice/accountSlice";
import { store } from "~/store/store";
import jwt_decode from "jwt-decode";

const newRequet = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    // withCredentials: true

})

let isRefreshing = false;

newRequet.interceptors.request.use(async config => {
    let accessToken = store.getState().account.accessToken

    if (accessToken) {
        const decodeJwt = jwt_decode(accessToken)
        if (decodeJwt.exp * 1000 < new Date().getTime()) {
            const refreshToken = store.getState().account.refreshToken

            if (!isRefreshing) {
                isRefreshing = true
                await store.dispatch(fetchRefreshToken({ refreshToken }))
                    .then(data => {
                        localStorage.setItem('accessToken', data.payload.accessToken)
                        config.headers.Authorization = `Bearer ${data.payload.accessToken}`
                    })
                    .catch(err => {
                        console.log('err: ', err)
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
            }
        }
    }

    return config
})

export default newRequet