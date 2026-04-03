import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  hidePassword: boolean = true;
  hideCnfPassword: boolean = true;

  registerForm: FormGroup = new FormGroup({})

  constructor(private fb: FormBuilder, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnfPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { Validators: passwordMatchValidator })
  }

  get fullName() { return this.registerForm.get('fullName') }
  get email() { return this.registerForm.get('email') }
  get password() { return this.registerForm.get('password') }
  get cnfPassword() { return this.registerForm.get('cnfPassword') }

  registerSubmit() {
    if (!this.registerForm.valid) return;
    let registerData = this.registerForm.value;

    let regObj = {
      fullName: registerData.fullName.trim(),
      email: registerData.email,
      password: registerData.password,
    }
    this.authService.registerUser(regObj).subscribe((data: any) => {
      console.log(data);

    })

  }
}
