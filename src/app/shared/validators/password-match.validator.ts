import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const cnfPassword = control.get('cnfPassword')?.value;

    if (password && cnfPassword && password !== cnfPassword) {
        return { passwordMismatch: true }
    }
    return null
}