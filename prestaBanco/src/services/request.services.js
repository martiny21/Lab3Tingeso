import httpClient from "../http-common.js";

const create = (data,id) =>{
    return httpClient.post(`/api/requests/${id}/make`,data);
}

const evaluate = id => {
    return httpClient.put(`/api/requests/${id}/evaluate`);
}

const getAll = () => {
    return httpClient.get('/api/requests/allRequests');
}

export default {create, evaluate, getAll}