import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SnackbarService } from '../../core/services/snackbar.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

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
    MatDividerModule,
    MatProgressBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup = new FormGroup({});
  hidePassword = true;
  uploading = false;
  // user: any = null;
  user = signal<any>(null);

  constructor() {
    effect(() => {
      console.log('User changed:', this.user());
    })
  }

  private fb = inject(FormBuilder);
  private snackbar = inject(SnackbarService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // get user from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      // this.user = JSON.parse(userInfo);
      this.user.set(JSON.parse(userInfo))
    }

    this.profileForm = this.fb.group({
      fullName: [this.user()?.fullName || '', [Validators.required]],
      email: [this.user()?.email || '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]  // ← optional, no required validator
    });
  }

  // get initials from name for avatar
  getInitials(): string {
    if (!this.user()?.fullName) return '?';
    return this.user().fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);  // max 2 letters
  }

  // build full URL for profile pic
  getProfilePicUrl(): string {

    // return `${environment.baseURL}${this.user()?.profilePic}`;
    return `http://localhost:8080/${this.user()?.profilePic}`;
  }

  // handle file selection
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // validate size — 2MB max
    if (file.size > 2 * 1024 * 1024) {
      this.snackbar.error('File size must be less than 2MB');
      return;
    }

    this.uploading = true;

    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('_id', this.user()?._id);

    this.authService.uploadProfilePic(formData).subscribe({
      next: (res: any) => {
        if (res?.status) {
          const updated = { ...this.user(), profilePic: res.data?.profilePic };
          localStorage.setItem('userInfo', JSON.stringify(updated));
          this.user.set(updated);
          this.snackbar.success('Profile picture updated!');
        }
        this.uploading = false;
      },
      error: () => {
        this.snackbar.error('Failed to upload profile picture!');
        this.uploading = false;
      }
    })
  }

  // onSubmit(): void {
  //   if (this.profileForm.invalid) return;

  //   // update localStorage with new name/email
  //   const updated = {
  //     ...this.user,
  //     fullName: this.profileForm.value.fullName,
  //     email: this.profileForm.value.email,
  //     password: this.profileForm.value.password
  //   };

  //   this.authService.updateUser(updated).subscribe((data: any) => {

  //     if (data?.status) {
  //       this.user = data?.data
  //       this.profileForm.get('password')?.setValue('');
  //     }
  //   })

  //   localStorage.setItem('userInfo', JSON.stringify(updated));
  //   // this.user = updated;
  //   this.user.set(updated)

  //   this.snackbar.success('Profile updated successfully!');
  // }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const payload = {
      _id: this.user()?._id,
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.email,
      ...(this.profileForm.value.password && { password: this.profileForm.value.password })
    };

    this.authService.updateUser(payload).subscribe({
      next: (res: any) => {
        if (res?.status) {
          const updated = { ...this.user(), ...payload };
          localStorage.setItem('userInfo', JSON.stringify(updated));
          this.user.set(updated);
          this.snackbar.success('Profile updated successfully!');
        }
      },
      error: () => this.snackbar.error('Failed to update profile!')
    });
  }
}