import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { CONFIG } from '../../../_config/config';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { AppHighlights } from '../../../shared/directives/appHighlight.directive';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    TruncatePipe,
    AppHighlights
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, AfterViewInit, DoCheck {
  // products: Product[] = [];
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private confirmDialog = inject(ConfirmDialogService);

  private cdr = inject(ChangeDetectorRef);


  constructor(private dialog: MatDialog, private productService: ProductService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngDoCheck(): void {
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // reset to first page when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadProducts() {
    this.productService.getProducts(CONFIG.getProduct).subscribe((data: any) => {
      if (data?.status) {
        this.snackbar.success(data?.message);
        this.dataSource.data = data?.data
        this.cdr.markForCheck();  // ← tell Angular to check this component
        // this.products = data?.data
      } else {
        this.snackbar.error('Failed to load products!')
      }
    })
  }

  openDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      disableClose: true,
      data: product || null
    })

    // runs after dialog has closed
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (product) {
        this.updateProduct(product._id!, result);
      } else {
        this.saveProduct(result);
      }

    })
  }

  // saveProduct(data: Product) {
  //   this.productService.createProduct(CONFIG.createProduct, data).subscribe((data: any) => {
  //     if (data?.status) {
  //       this.snackbar.success('Product added successfully!');
  //       this.loadProducts();
  //     }
  //   })
  // }
  saveProduct(data: Product) {
    this.productService.createProduct(CONFIG.createProduct, data).subscribe({
      next: (resp: any) => {
        if (resp.status) {
          this.snackbar.success('Product added successfully!');
          this.loadProducts();
        }
      },
      error: (err: any) => {
        this.snackbar.error('Failed to update product!');
      }
    })
  }

  updateProduct(id: string, data: Product) {
    this.productService.updateProduct(CONFIG.updateProduct, id, data).subscribe((data) => {
      if (data?.status) {
        this.snackbar.success('Product added successfully!');
        this.loadProducts();
      } else {
        this.snackbar.error('Failed to add product!');
      }
    })
  }

  deleteProduct(id: string): void {
    this.confirmDialog.confirm(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      "Delete",
      "Cancel"
    ).subscribe(result => {
      if (result) {
        this.productService.deleteProduct(CONFIG.deleteProduct, id).subscribe({
          next: (res: any) => {
            if (res?.status) {
              this.snackbar.success('Product deleted successfully!');
              this.loadProducts();
            }
          },
          error: () => this.snackbar.error('Failed to delete product!')
        });
      }
    })
  }

}
