interface AddressDto {
  name: string;
  lastName: string;
  address1: string;
  city: string;
  postalCode: string;
  state?: string;
  country: string;
  email: string;
  phone: string;
}

export class CreateOrderDto {
  razorpayPaymentId: string;
  address: AddressDto;
}
