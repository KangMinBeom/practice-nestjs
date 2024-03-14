import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ProductService } from '../service/product.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly productService: ProductService,
  ) {}

  @Post('/order')
  async initOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.paymentService.initOrder(createOrderDto);
  }

  @Get('order/:orderId')
  async completeOrder(@Param('orderId') orderId: string) {
    return this.paymentService.completeOrder(orderId);
  }

  @Get('confirm')
  async confirmPayment(@Query() paymentInfo: any): Promise<any> {
    const confirmResponse =
      await this.paymentService.confirmPayment(paymentInfo);
    return { data: confirmResponse };
  }
}
