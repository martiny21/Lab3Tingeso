import http from '../http-common';

const upload = (fileName, file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', fileName);
    formData.append('userId', userId);

    return http.post('/api/document/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).catch((error) => {
        console.error('Error al subir archivo', error);
        alert('Error al subir archivo');
    });
}

export default {upload};