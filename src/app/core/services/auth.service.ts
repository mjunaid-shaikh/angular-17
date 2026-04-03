import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    base_URL = environment.baseURL
    register_URL: string = 'auth/register';
    login_URL: string = 'auth/login';

    constructor(private http: HttpClient, private router: Router) { }


    registerUser(data: { fullName: string, email: string, password: string }) {
        return this.http.post(this.base_URL + this.register_URL, data)
    }

    loginUser(data: { email: string, password: string }) {
        return this.http.post(this.base_URL + this.login_URL, data);
    }

    logout() {
        localStorage.clear();
        return this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

}