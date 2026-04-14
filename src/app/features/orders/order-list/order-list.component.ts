import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../../../core/services/order.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AppHighlights } from '../../../shared/directives/appHighlight.directive';
// import { Order } from '../../../core/models/order';
import { CONFIG } from '../../../_config/config';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    AppHighlights
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id', 'customerName', 'email',
    'items', 'totalAmount', 'createdAt', 'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private orderService = inject(OrderService);
  private confirmDialog = inject(ConfirmDialogService);
  private snackbar = inject(SnackbarService);

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    this.orderService.getAllOrders(CONFIG.getAllOrders).subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.dataSource.data = res.data;
        }
      },
      error: () => this.snackbar.error('Failed to load orders!')
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteOrder(id: string): void {
    this.confirmDialog.confirm(
      'Delete Order',
      'Are you sure you want to delete this order?',
      'Delete',
      'Cancel'
    ).subscribe(result => {
      if (result) {
        this.orderService.deleteOrderList(CONFIG.getDeleteOrder, id).subscribe({
          next: (res: any) => {
            if (res?.status) {
              this.snackbar.success('Order deleted successfully!');
              this.loadOrders();
            }
          },
          error: () => this.snackbar.error('Failed to delete order!')
        });
      }
    });
  }
}