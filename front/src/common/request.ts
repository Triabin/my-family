import axios from 'axios';
import router from '@/router';

// 创建实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.log(`请求错误: ${error}`);
  return Promise.reject(error);
});
service.interceptors.response.use(response => {
  const res = response.data;
  if (response.status && response.status !== 200 && response.status !== 201) {
    console.warn(`业务错误: ${res.message}`)
    return Promise.reject(new Error(res.message || 'Error'));
  }
  return response;
}, error => {
  const status = error.response?.status;
  switch (status) {
    case 400:
      console.error('请求参数错误');
      break;
    case 401:
      console.error('未授权或者token过期，请登录');
      window.location.href = '/#/login';
      break;
    case 403:
      console.error('禁止访问');
      break;
    case 404:
      console.error('请求地址不存在');
      break;
    case 408:
      console.error('请求超时');
      break;
    case 500:
      console.error('服务器内部错误');
      break;
    case 501:
      console.error('服务未实现');
      break;
    case 502:
      console.error('网关错误');
      break;
    case 503:
      console.error('服务不可用');
      break;
    case 504:
      console.error('网关超时');
      break;
    case 505:
      console.error('HTTP版本不受支持');
      break;
    default:
      console.error(`连接错误: ${error.message}`);
  }
  return Promise.reject(error);
});

export default service;
