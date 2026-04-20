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
    updateUser_URL: string = 'auth/update-user';

    constructor(private http: HttpClient, private router: Router) { }

    getUser(): void | any {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    getRole(): string {
        return this.getUser()?.role || 'user';
    }

    isAdmin(): boolean {
        return this.getRole() === 'admin';
    }


    registerUser(data: { fullName: string, email: string, password: string }) {
        return this.http.post(this.base_URL + this.register_URL, data)
    }

    loginUser(data: { email: string, password: string }) {
        return this.http.post(this.base_URL + this.login_URL, data);
    }

    updateUser(data: any) {
        return this.http.put(this.base_URL + this.updateUser_URL, data);
    }

    uploadProfilePic(formData: FormData) {
        return this.http.post(this.base_URL + 'auth/upload-profile-pic', formData);
    }

    logout() {
        localStorage.clear();
        return this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

}