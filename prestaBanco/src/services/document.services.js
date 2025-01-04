import httpClient from '../http-common.js';

const upload =  async (fileName, file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('name', fileName);
    

    try {
        await httpClient.post('/api/document/upload', formData, 
            { headers: { 'Content-Type': 'multipart/form-data' }});
        } catch (error) {
            console.error('Error al subir documento', error);
            alert('Error al subir documento');
        }
}

const getDocuments = async (userId) => {
    try {
        const response = await httpClient.get(`/api/document/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener documentos', error);
        alert('Error al obtener documentos');
    }
}

const download = async (documentId) => {
    try {
        const response = await httpClient.get(`/api/document/download/${documentId}`, 
            {responseType: 'blob'});
            return response;
        } catch (error) {
            console.error('Error al descargar documento', error);
            alert('Error al descargar documento');
        }
};

export default {upload, getDocuments, download};