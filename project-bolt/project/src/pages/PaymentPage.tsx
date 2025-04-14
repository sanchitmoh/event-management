import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Ban as Bank, Shield, ChevronRight, Check } from 'lucide-react';
import paymentService, { PaymentRequest } from '../services/payment.service';
import { useAuth } from '../context/AuthContext';

// Declare Razorpay as global
declare global {
  interface Window {
    Razorpay: {
      new (options: object): {
        open(): void;
      };
    };
  }
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay securely with your card'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Wallet,
    description: 'Google Pay, PhonePe, Paytm & more'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Bank,
    description: 'All major banks supported'
  }
];

const BANKS = [
  { id: 'sbi', name: 'State Bank of India', logo: 'https://example.com/sbi.png' },
  { id: 'hdfc', name: 'HDFC Bank', logo: 'https://example.com/hdfc.png' },
  { id: 'icici', name: 'ICICI Bank', logo: 'https://example.com/icici.png' },
  { id: 'axis', name: 'Axis Bank', logo: 'https://example.com/axis.png' }
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve booking details from location state or mock data
  const bookingDetails = location.state?.bookingDetails || {
    eventId: 1,
    eventType: 'CONCERT',
    seats: ['A1', 'A2'],
    subtotal: 2000,
    discount: 200,
    tax: 180,
    total: 1980
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        amount: bookingDetails.total,
        currency: 'INR',
        eventType: bookingDetails.eventType,
        eventId: bookingDetails.eventId,
        seatIds: bookingDetails.seats,
        bookingNotes: couponCode ? `Coupon: ${couponCode}` : undefined
      };

      // Create order in backend
      const orderResponse = await paymentService.createOrder(paymentRequest);
      
      if (orderResponse.status === 'ERROR') {
        throw new Error(orderResponse.errorMessage || 'Failed to create payment order');
      }
      
      // Configure Razorpay options
      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount * 100, // Convert to smallest currency unit
        currency: orderResponse.currency,
        name: 'Event Management',
        description: `Booking for ${bookingDetails.eventType}`,
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment with backend
            const verifyResponse = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyResponse.status === 'COMPLETED') {
              // Payment successful - redirect to confirmation
              navigate('/checkout/' + verifyResponse.orderId, { 
                state: { 
                  paymentSuccess: true,
                  paymentDetails: verifyResponse
                } 
              });
            } else {
              setError('Payment verification failed: ' + verifyResponse.errorMessage);
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Failed to verify payment. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.username || '',
          email: user?.email || ''
        },
        theme: {
          color: '#4F46E5' // Indigo color
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };
      
      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const subtotal = bookingDetails.subtotal;
  const discount = bookingDetails.discount;
  const tax = bookingDetails.tax;
  const total = bookingDetails.total;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center p-4 border rounded-lg transition-colors ${
                      selectedMethod === method.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-600'
                    }`}
                  >
                    <method.icon className="h-6 w-6 text-indigo-600" />
                    <div className="ml-4 flex-1 text-left">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    {selectedMethod === method.id ? (
                      <Check className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Selection (shown only for netbanking) */}
            {selectedMethod === 'netbanking' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Select Bank</h3>
                <div className="grid grid-cols-2 gap-4">
                  {BANKS.map(bank => (
                    <button
                      key={bank.id}
                      className="p-4 border rounded-lg hover:border-indigo-600 transition-colors"
                    >
                      <p className="font-medium">{bank.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Details (shown only for card payment) */}
            {selectedMethod === 'card' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mt-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Apply
                  </button>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{total}</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center text-gray-600">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Secure payment powered by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}