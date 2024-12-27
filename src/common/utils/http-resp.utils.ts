import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

export async function axiosErrorHandler<T>(
    axiosPromise: Promise<AxiosResponse<T>>,
): Promise<T> {
    try {
        const response = await axiosPromise;
        return response.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            throw new HttpException(data, status);
        } else if (error.request) {
            throw new HttpException('No se recibió respuesta del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            throw new HttpException('Error en la configuración de la solicitud', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
