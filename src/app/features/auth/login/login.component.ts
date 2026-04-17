import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  hidePassword: boolean = true;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private snackbar: SnackbarService) { }

  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }

  ngOnInit(): void {
    console.log('onInit');

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    if (!this.loginForm.valid) return
    let formValue = this.loginForm.value;

    // this.authService.loginUser(formValue).subscribe((data: any) => {
    //   if (data?.status) {
    //     this.snackbar.success('Logged in successful!')
    //     localStorage.setItem('token', data?.data?.token)
    //     localStorage.setItem('userInfo', JSON.stringify(data?.data?.user))
    //     this.router.navigate(['/dashboard'])
    //   } else {
    //     this.snackbar.error('Invalid email or password!');
    //   }
    // })

    this.authService.loginUser(formValue).subscribe({
      next: (resp: any) => {
        if (resp.status) {
          this.snackbar.success('Logged in successful!')
          localStorage.setItem('token', resp?.data?.token)
          localStorage.setItem('userInfo', JSON.stringify(resp?.data?.user))
          this.router.navigate(['/dashboard'])
        }
      },
      error: (error) => {
        this.snackbar.error(error)
      }
    })
  }


}
