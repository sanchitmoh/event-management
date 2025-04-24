import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';
import authService from './auth.service';

// Types
export interface PaymentRequest {
  orderId?: string;
  amount: number;
  currency: string;
  eventType: 'CONCERT' | 'MOVIE' | 'SPORT' | 'EVENT';
  eventId: number;
  seatIds: string[];
  bookingNotes?: string;
}

export interface PaymentResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  status: string;
  paymentId?: string;
  orderId: string;
  errorMessage?: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

class PaymentService {
  async createOrder(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
 try{
  const response = await axios.post(
    API_ENDPOINTS.PAYMENT + '/create-order',
    paymentRequest,
    {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    }
  );
  return response.data;
 } catch (err: unknown) {
  console.error('Payment API Error:', err);
  throw new Error('Payment failed. Please try again.');
 }
  }
  async verifyPayment(verificationData: PaymentVerificationRequest): Promise<PaymentResponse> {
    const params = new URLSearchParams();
    params.append('razorpay_order_id', verificationData.razorpay_order_id);
    params.append('razorpay_payment_id', verificationData.razorpay_payment_id);
    params.append('razorpay_signature', verificationData.razorpay_signature);

    const response = await axios.post(
      API_ENDPOINTS.PAYMENT + '/verify',
      params,
      {
        headers: {
          'Authorization': 'Bearer ' + authService.getToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  }

  async getUserPayments() {
    const response = await axios.get(
      API_ENDPOINTS.PAYMENT + '/user',
      {
        headers: {
          'Authorization': 'Bearer ' + authService.getToken()
        }
      }
    );
    return response.data;
  }

  async getPaymentDetails(orderId: string) {
    const response = await axios.get(
      API_ENDPOINTS.PAYMENT + '/' + orderId,
      {
        headers: {
          'Authorization': 'Bearer ' + authService.getToken()
        }
      }
    );
    return response.data;
  }
}

export default new PaymentService(); 