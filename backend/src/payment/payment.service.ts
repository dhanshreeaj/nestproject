import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Razorpay from 'razorpay';
import { CreateOrderDto } from 'src/dto/createorder';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
 // private shiprocketToken:string;
  private razorpay: any;

  constructor(private prisma:PrismaService,private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(amount: number) {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'receipt#1',
    };
    const order = await this.razorpay.orders.create(options);
    return order;
  }

  
 private shiprocketToken: string | null = null;
private tokenExpiry: number | null = null;
//generate token and authentication api
private async getShiprocketToken(): Promise<string> {
  if (this.shiprocketToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
    return this.shiprocketToken;
  }

  const email = this.configService.get<string>('SHIPROCKET_EMAIL');
  const password = this.configService.get<string>('SHIPROCKET_PASSWORD');

  try {
    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      { email, password }
    );

    const token = response.data.token;

    if (!token) {
      throw new Error('No token received from Shiprocket');
    }

    this.shiprocketToken = token;
    this.tokenExpiry = Date.now() + 11 * 60 * 60 * 1000; // Expires in 11 hours

    return token;
  } catch (error) {
    console.error('Shiprocket login failed:', error.response?.data || error.message);
    throw new Error('Too many failed login attempts. Please wait and try again.');
  }
}
async storePaymentDetails(
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
  email: string,
  amount: number,
) {
  return this.prisma.payment.create({
    data: {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      email,
      amount,
    },
  });
}

//confirmation order
  async confirmOrder(dto: CreateOrderDto) {
  try {
    const { razorpayPaymentId, address } = dto;

   const savedOrder = await this.prisma.order.create({
  data: {
    razorpayId: razorpayPaymentId,
    name: address.name,
    lastName: address.lastName,
    address1: "Very big addressssadfas fkaslf asdlf;j410206",
    city: address.city,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
    email: address.email,
  },
});


   // const token = await this.getShiprocketToken();



   // console.log({token})

//   const payload = {
//   order_id: savedOrder.id,
//   order_date: new Date().toISOString().slice(0, 10),
// pickup_location: "Jammu",
//   comment: "Reseller: M/s Goku",

//   billing_customer_name: `${address.name} ${address.lastName}`,
//   // billing_address: address.address1 || 'N/A',
//     billing_address: 'A random billing address',
//     billing_address_2: 'Near Hokage House',

//   billing_city: address.city || 'N/A',
//   billing_pincode: address.postalCode || '000000',
//   billing_state: address.state || 'Maharashtra',
//   billing_country: address.country || 'India',
//   billing_email: address.email || 'noemail@example.com',
//   billing_phone: address.phone || '0000000000',

//   shipping_is_billing: true,
 
// shipping_customer_name: `${address.name} ${address.lastName}`,
//   // shipping_address: address.address1 || 'N/A',
//       shipping_address: 'A random billing address',
//     shipping_address_2: 'Near Hokage House',
//   shipping_city: address.city || 'N/A',
//   shipping_pincode: address.postalCode || '000000',
//   shipping_state: address.state || 'Maharashtra',
//   shipping_country: address.country || 'India',
//   shipping_email: address.email || 'noemail@example.com',
//   shipping_phone: address.phone || '0000000000',

//   order_items: [
//     {
//       name: 'Test Item',
//       sku: 'test001',
//       units: 1,
//       selling_price: 500,
//        discount: "",
//       tax: "",
//       hsn: 441122
//     }
//   ],

//   payment_method: 'Prepaid',
//   sub_total: 500, 
//   shipping_charges: 0,
//   giftwrap_charges: 0,
//   transaction_charges: 0,
//   total_discount: 0,
//   length: 10,
//   breadth: 15,
//   height: 20,
//   weight: 2.5
// };

// const payload = {
//   "order_id": Math.random().toString().split(".").join(''),
//   "order_date": "2019-07-24 11:11",
//   "pickup_location": "Jammu",
//   "comment": "Reseller: M/s Goku",
//   "billing_customer_name": "Naruto",
//   "billing_last_name": "Uzumaki",
//   "billing_address": "House 221B, Leaf Village",
//   "billing_address_2": "Near Hokage House",
//   "billing_city": "New Delhi",
//   "billing_pincode": 110002,
//   "billing_state": "Delhi",
//   "billing_country": "India",
//   "billing_email": "naruto@uzumaki.com",
//   "billing_phone": 9876543210,
//   "shipping_is_billing": true,
//   "shipping_customer_name": "Naruto",
//   "shipping_last_name": "Uzumaki",
//   "shipping_address": "House 221B, Leaf Village",
//   "shipping_address_2": "Near Hokage House",
//   "shipping_city": "New Delhi",
//   "shipping_pincode": 110002,
//   "shipping_country": "India",
//   "shipping_state": "Delhi",
//   "shipping_email": "naruto@uzumaki.com",
//   "shipping_phone": 9876543210,
//   "order_items": [
//     {
//       "name": "Kunai",
//       "sku": "chakra123",
//       "units": 10,
//       "selling_price": 900,
//       "discount": "",
//       "tax": "",
//       "hsn": 441122
//     }
//   ],
//   "payment_method": "Prepaid",
//   "shipping_charges": 0,
//   "giftwrap_charges": 0,
//   "transaction_charges": 0,
//   "total_discount": 0,
//   "sub_total": 9000,
//   "length": 10,
//   "breadth": 15,
//   "height": 20,
//   "weight": 2.5
// }

//console.log({payload})

// console.log("Hi")

//const data = JSON.stringify(payload)

// var config = {
//   method: 'post',
// maxBodyLength: Infinity,
//   url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Authorization': `Bearer ${token}`
//   },
//   data : data
// };

//await axios(config)

// await axios.post(
//   'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
//   payload,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );

    // Save Shiprocket order ID
    // await this.prisma.order.update({
    //   where: { id: savedOrder.id },
    //   data: {
    //     shiprocketOrderId: response.data.order_id.toString(),
    //   },
    // });

    return { success: true };
  } catch (err) {
    // console.error("Shiprocket Order Failed", err.response?.data || err.message || err);
        console.error("Shiprocket Order Failed",  err.response.data );

    // throw new Error("Failed to confirm order with Shiprocket");
  }
}

}