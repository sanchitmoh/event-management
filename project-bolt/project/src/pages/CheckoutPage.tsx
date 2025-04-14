import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Shield, ArrowLeft } from 'lucide-react';
import paymentService from '../services/payment.service';

export default function CheckoutPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    paymentId?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get payment status from location state if available
  const paymentSuccess = location.state?.paymentSuccess || false;
  const paymentDetails = location.state?.paymentDetails || null;

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (paymentDetails) {
          setOrder(paymentDetails);
          setLoading(false);
          return;
        }
        
        if (bookingId) {
          const orderDetails = await paymentService.getPaymentDetails(bookingId);
          setOrder(orderDetails);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load payment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [bookingId, paymentDetails]);

  const handleBack = () => {
    navigate('/');
  };

  const handleViewTickets = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Payment Status */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            {paymentSuccess ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                <p className="mt-2 text-gray-600">
                  Your payment has been processed successfully.
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
                <p className="mt-2 text-gray-600">
                  {error || 'Your payment could not be processed. Please try again.'}
                </p>
              </>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{order.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium">{order.paymentId || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Security Information */}
          <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-lg mb-8">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">
              This transaction is secure and encrypted. Your payment details are protected.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Return to Home
            </button>
            {paymentSuccess && (
              <button
                onClick={handleViewTickets}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                View My Tickets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}