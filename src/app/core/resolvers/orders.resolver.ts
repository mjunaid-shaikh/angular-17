import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CONFIG } from '../../_config/config';

export const ordersResolver: ResolveFn<any> = () => {
  return inject(OrderService).getOrders();
};