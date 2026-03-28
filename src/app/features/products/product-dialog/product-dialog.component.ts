import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,

  ],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent implements OnInit {
  isEditMode = false;

  productForm: FormGroup = new FormGroup({})

  constructor(private dialogRef: MatDialogRef<ProductDialogComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Product | null) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data
    console.log(this.data, 'dddd')

    this.productForm = this.fb.group({
      name: [this.data?.name || '', [Validators.required, Validators.minLength(3)]],
      category: [this.data?.category || '', [Validators.required]],
      price: [this.data?.price || '', [Validators.required]],
      stock: [this.data?.stock || '', [Validators.required]],
      status: [this.data?.status || '', [Validators.required]],
      description: [this.data?.description || '', [Validators.required]],
    })

    console.log('testForm', this.data);

  }

  onSave() {
    if (this.productForm.invalid) return
    this.dialogRef.close(this.productForm?.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
