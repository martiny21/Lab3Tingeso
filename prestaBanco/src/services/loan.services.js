import httpClient from "../http-common.js";

const create = (data,id) =>{
    return httpClient.post(`/api/loans/${id}/make`,data);
}

export default {create}