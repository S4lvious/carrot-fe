import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface User {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed.
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + '/user'; // Replace with your API endpoint.

    constructor(private http: HttpClient) { }

    // Create a new user.

    // Get all users.
    getUser(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl + '/getUser');
    }

    // Get a single user by ID.
    getUserById(id: string): Observable<User> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<User>(url);
    }

    upgradeSub(planName: string, userId: number) {
        let params = {
            planName: planName,
            userId: userId.toString() // Assicuriamoci che sia una stringa
        };
    
        const url = 'https://api.powerwebsoftware.it/payments/checkout';
        
        return this.http.post(url, {}, { params: params, responseType: 'text' });
    }    

    // Update a user.
    updateUser(user: User): Observable<User> {
        const url = `${this.apiUrl}`;
        return this.http.put<User>(url, user);
    }

    completeProfile(user: User) : Observable<string> {
        return this.http.post(this.apiUrl+'/complete-profile', user, {responseType: 'text'});
    }

    // Delete a user.
    deleteUser(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url);
    }
}