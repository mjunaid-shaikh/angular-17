import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SnackbarService } from '../../core/services/snackbar.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup = new FormGroup({});
  hidePassword = true;
  user: any = null;

  private fb = inject(FormBuilder);
  private snackbar = inject(SnackbarService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // get user from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    this.profileForm = this.fb.group({
      fullName: [this.user?.fullName || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]  // ← optional, no required validator
    });
  }

  // get initials from name for avatar
  getInitials(): string {
    if (!this.user?.fullName) return '?';
    return this.user.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);  // max 2 letters
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    // update localStorage with new name/email
    const updated = {
      ...this.user,
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.email,
      password: this.profileForm.value.password
    };

    this.authService.updateUser(updated).subscribe((data: any) => {

      if (data?.status) {
        this.user = data?.data
        this.profileForm.get('password')?.setValue('');
      }
    })

    localStorage.setItem('userInfo', JSON.stringify(updated));
    this.user = updated;

    this.snackbar.success('Profile updated successfully!');
  }
}