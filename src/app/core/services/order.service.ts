import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Order } from "../models/orders";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) { }

    createOrders(url: string, data: any): Observable<any> {
        return this.http.post(environment.baseURL + url, data)
    }

    getAllOrders(url: string) {
        return this.http.get(environment.baseURL + url)
    }

    getOrderById(url: string, id: string) {
        return this.http.get(`${environment.baseURL}${url}/${id}`);
    }

    deleteOrder(url: string, id: string) {
        return this.http.delete(`${environment.baseURL}${url}/${id}`);
    }

    getAllOrdersList(url: string) {
        return this.http.get(environment.baseURL + url)
    }

    deleteOrderList(url: string, id: string) {
        return this.http.delete(`${environment.baseURL}${url}/${id}`);
    }
}