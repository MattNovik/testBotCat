import http from 'libs/http';
import { API_URL } from 'constants/api';

export interface ICreateOrderFromBotData {
    name: string;
    email: string;
    type_of_work: string;
    theme: string;
    course: string;
    note: string;
    base64_files?: string | string[];
    files?: any,
    vkid: any,
    city: any,
    clientForm: any
}

export interface IEditOrderFromBotData {
    user_id: string;
    phone: string;
    hash?: string;
    authtoken?: string;
}

export function fetchWorkTypesList(): Promise<API.IWorkTypesList> {
    return http.get(`${API_URL}getWorkTypesList/`).then(response => response);
}

export function fetchCoursesList(): Promise<API.ICoursesList> {
    return http.get(`${API_URL}getCoursesList/`).then(response => response);
}

export function createOrderFromBot(data: ICreateOrderFromBotData, files: any): Promise<API.ICreateOrderFromBot> {
    return http.post(`${API_URL}createOrderFromBot/`, { data, files }).then(response => response);
}

export function editOrderFromBot(data: IEditOrderFromBotData): Promise<API.IEditOrderFromBot> {
    return http.post(`${API_URL}updateUser/`, { data }).then(response => response);
}

