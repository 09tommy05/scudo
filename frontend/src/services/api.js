import axios from 'axios';


let baseUrl= import.meta.env.VITE_API_HOST || 'http://localhost:3215';
baseUrl += '/v1';

const api = axios.create({
    baseURL: baseUrl, 
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
        const form = new FormData();
        form.append('title', data.title);
        form.append('text', data.text);
        form.append('short_text', data.short_text);
        form.append('categoria', data.categoria);
        if (data.img instanceof File) form.append('img', data.img);
        return api.post('/articles?draft=' + (data.isDraft === true ? 'true' : 'false'), form);
    },
    updateArticle(id, data) {
        const form = new FormData();
        form.append('title', data.title);
        form.append('text', data.text);
        form.append('short_text', data.short_text);
        form.append('categoria', data.categoria);
        form.append('isDraft', data.isDraft === true);
        if (data.img instanceof File) form.append('img', data.img);
        return api.put(`/articles/${id}`, form);
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
    setFirstPassword(id, token, password) {
        return api.patch(`/auth/operator/${id}/?token=${token}`, {
            newPassword: password,
        });
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

    // user
    getMyReports(){
        return api.get("user/reports")
    },
    updateNotificationStatus(allow_notifications){
        return api.patch('user/me/notifications', { allow_notifications });
    },
    // Communications
    getCommunications(params) {
        return api.get('/communications', { params });
    },
    getCommunicationById(id) {
        return api.get(`/communications/${id}`);
    },
    createCommunication(data) {
        const params = {};
        if (data.isDraft !== undefined) params.draft = data.isDraft ? 'true' : 'false';
        if (data.notify !== undefined) params.notify = data.notify ? 'true' : 'false';
        return api.post('/communications', data, { params });
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
