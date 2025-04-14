/**
 * Application configuration
 * Different configurations for development, production, and test environments
 */

const development = {
  apiUrl: 'http://localhost:8080/api',
  websocketUrl: 'http://localhost:8080/api/ws',
  enableLogging: true,
  paymentGateway: {
    publicKey: 'rzp_test_yourkeyhere',
    name: 'Event Management',
    description: 'Event Tickets',
    currency: 'INR',
    image: '/logo.png'
  }
};

const production = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://api.eventmanagement.com/api',
  websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || 'https://api.eventmanagement.com/api/ws',
  enableLogging: false,
  paymentGateway: {
    publicKey: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_live_yourkeyhere',
    name: 'Event Management',
    description: 'Event Tickets',
    currency: 'INR',
    image: '/logo.png'
  }
};

const test = {
  apiUrl: 'http://localhost:8080/api',
  websocketUrl: 'http://localhost:8080/api/ws',
  enableLogging: false,
  paymentGateway: {
    publicKey: 'rzp_test_yourkeyhere',
    name: 'Event Management',
    description: 'Event Tickets',
    currency: 'INR',
    image: '/logo.png'
  }
};

let config: typeof development;

switch (process.env.NODE_ENV) {
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