import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { CONFIG } from '../../../_config/config';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'status', 'actions'];



  constructor(private dialog: MatDialog, private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(CONFIG.getProduct).subscribe((data: any) => {
      if (data?.status) {
        this.products = data?.data
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

  saveProduct(data: Product) {
    this.productService.createProduct(CONFIG.createProduct, data).subscribe((data: any) => {
      if (data?.status) {
        this.loadProducts();
      }
    })
  }

  updateProduct(id: string, data: Product) {
    this.productService.updateProduct(CONFIG.updateProduct, id, data).subscribe((data) => {
      if (data?.status) {
        this.loadProducts();
      }
    })
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(CONFIG.deleteProduct, id).subscribe((data) => {
      if (data.status) {
        this.loadProducts();
      }
    })
  }

}
