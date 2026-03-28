import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  base_URL = environment.baseURL;


  constructor(private http: HttpClient) { }


  //POST/Create Product
  createProduct(apiURL: string, data: Product): Observable<Product[]> {
    return this.http.post<Product[]>(this.base_URL + apiURL, data)
  }

  // GET products
  getProducts(apiURL: string) {
    return this.http.get<Product[]>(this.base_URL + apiURL);
  }

  // UPDATE product
  updateProduct(apiURL: string, id: string, data: Product) {
    return this.http.put<Product>(`${this.base_URL}${apiURL}/${id}`, data)
  }

  // DELETE Products
  deleteProduct(apiURL: string, productId: any) {
    return this.http.delete<Product>(`${this.base_URL}${apiURL}/${productId}`);
  }

}
