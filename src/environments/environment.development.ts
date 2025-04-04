import { Environment } from "../app/core/models/environment";


// AQUI DEBEMOS CAMBIARLO EL APIURL POR EL DE NUESTRO SERVIDOR CUANDO ESTE DADO DE ALTA
// apiUrl: 'https://tuapi-produccion.com/api'  // URL de tu servidor de producción

export const environment : Environment = {
    production: false,
    apiUrl: 'http://192.168.125.146:8000/api', 
};