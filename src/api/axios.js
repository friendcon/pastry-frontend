import axios from 'axios';
/**
 * API 호출시 반복되는 코드를 방지하기 위함
 */
const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 - JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터 - 인증 만료 시 토큰 삭제 및 메인페이지로 이동
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;