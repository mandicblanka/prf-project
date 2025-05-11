import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    isAuthenticated?: boolean;
    isAdmin?: boolean;

    constructor(private authService: AuthService, private router: Router) {
        authService.checkAuth().subscribe( (data) => {
            this.authService.changeAuthStatus(data);
        }, (err) => {
            console.log('You are currently not logged in.');
        });

        this.authService.authStatus.subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
        });

        authService.isAdmin().subscribe( (data) => {
            this.authService.changeAdminStatus(data);
        }, (err) => {
            console.log('You are not an admin.');
        });

        this.authService.adminStatus.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });
    }

    ngOnInit() {
    }

    navigate(to: string) {
        this.router.navigateByUrl(to);
    }

    logout() {
        this.authService.logout().subscribe({
            next: (data) => {
                console.log(data);
                this.router.navigateByUrl('/login');
                //this.isAuthenticated = false;
                this.authService.changeAuthStatus(false);
            }, error: (error) => {
                console.log(error);
            }
        });
    }
}
