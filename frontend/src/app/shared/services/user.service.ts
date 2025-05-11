import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Model/User';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>('http://localhost:3000/app/getAllUsers', {withCredentials: true});
    }

    deleteUser(userId: string) {
        return this.http.delete(`http://localhost:3000/app/delete_user/${userId}`, {withCredentials: true, responseType: 'text'});
    }
}
