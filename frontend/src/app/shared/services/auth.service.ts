import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Model/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authStatusSource = new BehaviorSubject<boolean>(false);
    private adminStatusSource = new BehaviorSubject<boolean>(false);
    authStatus = this.authStatusSource.asObservable();
    adminStatus = this.adminStatusSource.asObservable();

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        const body = new URLSearchParams();
        body.set('username', email);
        body.set('password', password);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post<User>('http://localhost:3000/app/login', body, {headers: headers, withCredentials: true});
    }

    register(user: User) {
        const body = new URLSearchParams();
        body.set('email', user.email);
        body.set('name', user.name);
        body.set('address', user.address);
        body.set('nickname', user.nickname);
        body.set('password', user.password);
        body.set('isAdmin', 'false');

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post('http://localhost:3000/app/register', body, {headers: headers});
    }

    logout() {
        return this.http.post('http://localhost:3000/app/logout', {}, {withCredentials: true, responseType: 'text'});
    }

    checkAuth() {
        return this.http.get<boolean>('http://localhost:3000/app/checkAuth', {withCredentials: true, responseType: 'json'});
    }

    isAdmin() {
        return this.http.get<boolean>('http://localhost:3000/app/isAdmin', {withCredentials: true, responseType: 'json'});
    }

    whoAmI() {
        return this.http.get<User>('http://localhost:3000/app/currentUser', {withCredentials: true});
    }

    changeAuthStatus(status: boolean) {
        this.authStatusSource.next(status);
    }

    changeAdminStatus(status: boolean) {
        this.adminStatusSource.next(status);
    }
}
