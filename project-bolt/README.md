# Event Management System

A comprehensive event management platform with real-time notifications, booking system, and payment integration.

## Architecture

### Backend (Spring Boot)
- **REST API**: Spring Boot application with JWT authentication
- **WebSockets**: Real-time notification system
- **Database**: MySQL for persistent storage
- **Caching**: Redis for performance optimization
- **Payment Integration**: Razorpay for secure payments

### Frontend (React/TypeScript)
- **UI Framework**: React with TypeScript
- **State Management**: React Context API and local hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Real-time Updates**: WebSocket with STOMP
- **3D Visualizations**: Three.js for venue models

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Java 17
- MySQL
- Redis (optional, for caching)

### Backend Setup
1. Configure database properties in `src/main/resources/application.yml`
2. Install dependencies and build:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd project-bolt/project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```
   VITE_API_URL=http://localhost:8080/api
   VITE_WEBSOCKET_URL=http://localhost:8080/api/ws
   VITE_RAZORPAY_KEY_ID=your_test_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Integration Points

### Authentication Flow
1. User logs in via `/auth/signin` endpoint
2. JWT token is returned and stored in localStorage
3. Token is included in all subsequent API calls
4. WebSocket connections are authenticated using the same token

### Real-time Notifications
1. Backend publishes notifications to topics:
   - User-specific: `/user/{username}/queue/notifications`
   - Global: `/topic/global-notifications`
2. Frontend subscribes to these topics through STOMP over WebSocket

### Payment Integration
1. Backend creates a payment order via Razorpay API
2. Frontend displays the payment form using Razorpay SDK
3. Payment callbacks update the booking status

## Testing

### API Testing
Use Postman collection in `docs/postman` for API testing.

### WebSocket Testing
1. Log in with user credentials
2. Navigate to profile or dashboard
3. Create a test notification using the admin panel
4. Verify real-time notification appears

## Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   mvn clean package -DskipTests
   ```
2. Deploy the JAR to your server or container platform

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` directory to your web server

## Security Considerations
- All API endpoints are secured with JWT authentication
- WebSocket connections require valid authentication
- CSRF protection implemented for form submissions
- Sensitive data like payment details are never stored on the frontend 