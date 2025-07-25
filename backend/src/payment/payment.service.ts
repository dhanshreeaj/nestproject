// import { Injectable } from "@nestjs/common";
// import Razorpay from "razorpay";
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class PaymentService{
//     private razorpay:Razorpay;
//     constructor(private configService: ConfigService) {
// const key_id = configService.get('RAZORPAY_KEY_ID');
// const key_secret= configService.get('RAZORPAY_KEY_SECRET');

// console.log({key_id, key_secret});

//     const instance = new Razorpay({
//   key_id,
//   key_secret ,
// });

// this.razorpay = instance;

// // console.log({instance})




//   }

//     async createOrder(amount:number){

//         console.log({amount})


//         try {
//         const order=await this.razorpay.orders.create({
//             amount:50000,
//             currency:'INR',
//             receipt:`receipt_order_${Date.now()}`,
//               "notes": {
//     "key1": "value3",
//     "key2": "value2"
//   },   "partial_payment": false,

//         });

//         return order;
//         } catch(error){
//         console.log({error})

//         }


//         // return order;
//     }
// }

import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private razorpay: any;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
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
}
