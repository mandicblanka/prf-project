import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule,
        CommonModule,
        RouterModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    errorMessage: string = '';
    isLoading = false;
    showPassword = false;
    id = this.route.snapshot.paramMap.get('id');

    constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.authService.checkAuth().subscribe({
            next: (data) => {
                if (data) {
                    this.navigate('/topics');
                }
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    login() {
        this.isLoading = true;
        if (this.email && this.password) {
            this.errorMessage = '';
            this.authService.login(this.email, this.password).subscribe({
                next: (data) => {
                    if (data) {
                        console.log(data);
                        this.authService.changeAuthStatus(true);
                        this.authService.changeAdminStatus(data.isAdmin);
                        this.isLoading = false;
                        if (this.id) {
                            this.navigate(`/topic/${this.id}`);
                        } else {
                            this.navigate('/topics');
                        }
                    }
                }, error: (err) => {
                    console.log(err);
                    this.errorMessage = 'Invalid email or password';
                    this.isLoading = false;
                },
            })
        } else {
            this.errorMessage = 'Missing credentials';
            this.isLoading = false;
        }
    }

    navigate(to: string) {
        this.router.navigateByUrl(to);
    }

    togglePassword() {

    }

}
