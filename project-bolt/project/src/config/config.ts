/**
 * Application configuration
 * Different configurations for development, production, and test environments
 */

const development = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
  websocketUrl: import.meta.env.VITE_WS_URL || 'http://localhost:8081/ws',
  enableLogging: true,
  paymentGateway: {
    publicKey: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere',
    name: 'Event Management',
    description: 'Event Tickets',
    currency: 'INR',
    image: '/logo.png'
  }
};

const production = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://api.eventmanagement.com/api',
  websocketUrl: import.meta.env.VITE_WS_URL || 'http://api.eventmanagement.com/ws',
  enableLogging: false,
  paymentGateway: {
    publicKey: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_yourkeyhere',
    name: 'Event Management',
    description: 'Event Tickets',
    currency: 'INR',
    image: '/logo.png'
  }
};

const test = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
  websocketUrl: import.meta.env.VITE_WS_URL || 'http://localhost:8081/api/ws',
  enableLogging: false,
  paymentGateway: {
    publicKey: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere',
    name: 'Event Management',
    description: 'Event Tickets',
    currency: 'INR',
    image: '/logo.png'
  }
};

let config: typeof development;

switch (import.meta.env.VITE_ENV || 'development') {
  case 'production':
    config = production;
    break;
  case 'test':
    config = test;
    break;
  default:
    config = development;
}

export default config; 