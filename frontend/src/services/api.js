import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_HOST + "/v1" || 'http://localhost:3010/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default {
    // Articles
    getArticles(params) {
        return api.get('/articles', { params });
    },
    getArticle(id) {
        return api.get(`/articles/${id}`);
    },
    createArticle(data) {
        return api.post('/articles', data);
    },
    updateArticle(id, data) {
        return api.put(`/articles/${id}`, data);
    },
    publishArticle(id) {
        return api.patch(`/articles/${id}`);
    },
    deleteArticle(id) {
        return api.delete(`/articles/${id}`);
    },
    getCategories() {
        return api.get('/articles/categories/');
    },

    // Auth - Operator
    loginOperator(email, password) {
        return api.post('/auth/operator/login', { email, password });
    },

    // Auth - SPID (Mock)
    loginSpid(email, password) {
        return api.post('/auth/spid/login', { email, password });
    },

    // Auth - CIE (Mock)
    loginCie(email, password) {
        return api.post('/auth/cie/login', { email, password });
    },

    // Auth - Me
    getMe() {
        return api.get('/auth/me/');
    },

    // Reports
    getReports(params) {
        return api.get('/reports', { params });
    },
    getReport(id) {
        return api.get(`/reports/${id}`);
    },
    createReport(data) {
        return api.post('/reports', data);
    },

    // Communications
    getCommunications(params) {
        return api.get('/communications', { params });
    },
    createCommunication(data) {
        return api.post('/communications', data);
    },
    updateCommunication(id, data) {
        return api.put(`/communications/${id}`, data);
    },
    publishCommunication(id, notify = false) {
        return api.patch(`/communications/${id}?notify=${notify}`);
    },
    deleteCommunication(id) {
        return api.delete(`/communications/${id}`);
    },

    // Operators
    getOperators(params) {
        return api.get('/operators', { params });
    },
    createOperator(data) {
        return api.post('/operators', data);
    },
    updateOperatorStatus(id, isActive) {
        return api.patch(`/operators/${id}`, { isActive });
    }
};
