import http from "../http-common.js";

const create = (data,id) =>{
    return http.post(`/api/requests/${id}/make`,data);
}

const evaluate = id => {
    return http.put(`/api/requests/${id}/evaluate`);
}

const getAll = () => {
    return http.get('/api/requests/allRequests');
}

const getRequestByUserId = id => {
    return http.get(`/api/requests/${id}/request`);
}

export default {create, evaluate, getAll, getRequestByUserId}