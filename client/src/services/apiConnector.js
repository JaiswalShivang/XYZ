import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
})

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers = {}) => {
  // For DELETE, do not send a body or data field
  if (method === 'DELETE') {
    return axiosInstance({
      method: 'DELETE',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }
  // For other methods, include data if present
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

export const apiConnectorWithFiles = (method, url, formData, headers = {}) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers,
    },
  })
}