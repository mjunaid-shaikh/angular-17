import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../core/services/order.service';
import { CONFIG } from '../../../_config/config';
import { Order } from '../../../core/models/orders';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
  imports: [
    ReactiveFormsModule,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ]
})
export class OrderFormComponent implements OnInit {

  orderForm!: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      items: this.fb.array([this.createItem()])
    });
  }

  // FormArray getter
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  get itemControls() {
    return this.items.controls;
  }

  // Create item row
  createItem(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Add row
  addItem(): void {
    this.items.push(this.createItem());
  }

  // Remove row
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // Subtotal
  getSubtotal(index: number): number {
    const item = this.items.at(index);
    const qty = item.get('qty')?.value || 0;
    const price = item.get('price')?.value || 0;
    return qty * price;
  }

  // Total
  getTotal(): number {
    return this.items.controls.reduce((total, _, i) => {
      return total + this.getSubtotal(i);
    }, 0);
  }

  // Submit
  onSubmit(): void {
    if (this.orderForm.valid) {
      let formValue = this.orderForm.value
      let orderRequest = {
        customerName: formValue?.customerName,
        email: formValue.email,
        items: formValue?.items
      }

      this.orderService.createOrders(CONFIG.createOrder, orderRequest).subscribe((orderData: any) => {
        if (orderData?.status) {
          this.snackbar.success(orderData?.message)
        } else {
          this.snackbar.error(orderData?.message)
        }
      })
    }
  }
}