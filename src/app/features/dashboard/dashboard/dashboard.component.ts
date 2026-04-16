import { Component, computed, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { CONFIG } from '../../../_config/config';
import { AppHighlights } from '../../../shared/directives/appHighlight.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    AppHighlights
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private products = signal<Product[]>([]);

  totalProducts = computed(() => this.products().length);
  activeProducts = computed(() => this.products().filter((p => p.status === 'active')).length);
  inactiveProducts = computed(() => this.products().filter((p => p.status === 'inactive')).length);
  totalStock = computed(() => this.products().reduce((acc, curr) => acc + curr.stock, 0));
  recentProducts = computed(() => this.products().slice(-5));

  displayedColumns: string[] = ['name', 'category', 'price', 'status'];

  // totalProducts: number = 0;
  // activeProducts: number = 0;
  // inactiveProducts: number = 0;
  // totalStock: number = 0;
  // recentProducts: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    console.log('test___', this.totalProducts, this.activeProducts, this.inactiveProducts)



    this.productService.getProducts(CONFIG.getProduct).subscribe((data: any) => {
      console.log('data', data)
      if (data?.status) {
        let pData = data?.data;

        this.products.set(data?.data)

        // this.totalProducts = pData?.length;
        // this.activeProducts = pData.filter((active: Product) => active.status === 'active').length;
        // this.inactiveProducts = pData.filter((inactive: Product) => inactive.status === 'inactive').length;
        // this.totalStock = pData.reduce((sum: number, el: Product) => sum + el.stock, 0);
        // this.recentProducts = pData.slice(-5);
      }
    })
  }

}
