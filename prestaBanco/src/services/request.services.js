import http from "../http-common.js";

const create = (data,id) =>{
    return http.post(`/api/requests/${id}/make`,data);
}

const evaluate = id => {
    return http.put(`/api/requests/${id}/evaluate`);
}

const evaluateSavingCapacity = (id, minimumSalary, consistentSavingHistory, periodicDeposit, salaryYearRelation, nearlyRetirements) => {
    return http.put(`/api/requests/${id}/updateSavingCapacity`, null, {
        params: {
            minimumSalary: Boolean(minimumSalary),
            consistentSavingHistory: Boolean(consistentSavingHistory),
            periodicDeposit: Boolean(periodicDeposit),
            salaryYearRelation: Boolean(salaryYearRelation),
            nearlyRetirements: Boolean(nearlyRetirements)
        }
    });
}

const getAll = () => {
    return http.get('/api/requests/allRequests');
}

const getRequestByUserId = id => {
    return http.get(`/api/requests/${id}/request`);
}

const updateStatus = (id, status) => {
    return http.put(`/api/requests/${id}/update`, null, {
        params: {
            status
        }
    });
}

export default {create, evaluate, getAll, getRequestByUserId, evaluateSavingCapacity, updateStatus};