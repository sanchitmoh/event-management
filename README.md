# Event Management System

A comprehensive event management platform with real-time notifications, booking system, payment integration, and advanced search capabilities.

## Features

- User Authentication & Authorization with JWT
- Role-based Access Control (User, Admin)
- Event Booking and Management
- Real-time Notifications via WebSocket
- Payment Integration with Razorpay
- Newsletter Subscription
- Advanced Search Functionality
- Seat Selection & Booking
- 3D Venue Visualization

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

For a comprehensive system design document, see [System Design Documentation](docs/SYSTEM_DESIGN.md).

## Database & Caching Design

### Core Database Schema

We use a relational database (MySQL) for transactional safety and ACID compliance.

#### Core Tables

| Table Name | Key Fields | Purpose |
|:-----------|:-----------|:--------|
| `users` | id, username, email, password_hash, role, created_at | User authentication and profiles |
| `roles` | id, name | Defines user roles (USER, ADMIN) |
| `user_roles` | user_id, role_id | Many-to-many relationship for role assignments |
| `events` | id, name, description, start_date, end_date, venue, category, price, status, available_seats, total_seats | Core event information |
| `event_seats` | id, event_id, row, number, section, price, status | Detailed seat information for events |
| `bookings` | id, user_id, event_id, booking_date, status, payment_status | User event bookings |
| `booking_seats` | booking_id, seat_id | Maps booked seats to bookings |
| `payments` | id, booking_id, amount, payment_date, transaction_id, status | Payment transaction records |
| `notifications` | id, user_id, message, type, status, created_at | System and event notifications |
| `newsletter_subscriptions` | id, email, name, status, created_at | Newsletter subscription information |

#### Key Database Design Principles

- **Normalization**: Tables are normalized to 3NF to eliminate redundancy
- **Foreign Keys**: Enforced relationships between related tables
- **Indexes**: Strategic indexing on frequently queried columns:
  - Primary keys and foreign keys
  - `events.start_date` and `events.status` for efficient event listing
  - `users.email` and `users.username` for login operations
  - `bookings.user_id` for user booking history
- **Soft Deletes**: Implemented with `deleted_at` timestamps for critical data
- **Timestamps**: `created_at` and `updated_at` on all tables for auditing

### Caching Strategy with Redis

Our caching implementation uses Redis for high-performance data retrieval and real-time state management.

#### Key Cache Structures

| Cache Key Pattern | Data | Expiration | Purpose |
|:------------------|:-----|:-----------|:--------|
| `event:{eventId}` | Event details JSON | 5 minutes | Fast event retrieval |
| `events:category:{category}` | List of event IDs | 10 minutes | Category-based listing |
| `events:upcoming` | List of upcoming event IDs | 15 minutes | Homepage and listing performance |
| `events:featured` | List of featured event IDs | 30 minutes | Homepage performance |
| `user:{userId}:bookings` | List of booking IDs | 30 minutes | User booking history |
| `event:{eventId}:available_seats` | Count or list of available seats | 1 minute | Real-time seat availability |
| `user_session:{token}` | User session data | 24 hours | Authentication state |

#### Caching Strategies Implemented

- **Cache-Aside Pattern**:
  - Check cache first for reads
  - Update both database and cache on writes
  - Cache misses populate the cache from the database

- **Write-Through for Critical Data**:
  - Seat availability updates are written to both Redis and MySQL
  - Uses Redis atomic operations (DECR/INCR) for seat counting

- **Cache Invalidation**:
  - Time-based expiration for most cache entries
  - Explicit invalidation on data updates
  - Event updates trigger immediate cache invalidation

- **Cache Consistency**:
  - Redis transactions for multi-step operations
  - Distributed locks for concurrent operations on critical data (seat booking)

### Data Consistency & Concurrency

- **Optimistic Locking**:
  - `version` field in `events` and `event_seats` tables
  - Prevents race conditions during concurrent updates

- **Redis Distributed Locks**:
  - Used for seat reservation process
  - Prevents double-booking of seats during high-concurrency periods

- **Rate Limiting**:
  - Redis-based rate limiting for API endpoints
  - Prevents abuse and ensures fair system usage

### Monitoring & Optimization

- **Cache Hit/Miss Ratio Monitoring**:
  - Tracks cache efficiency and optimizes TTL values

- **Slow Query Monitoring**:
  - Identifies database bottlenecks for optimization

- **Horizontal Scaling Readiness**:
  - Database read replicas for read-heavy operations
  - Redis Cluster configuration for cache scaling

### System Architecture Diagram

┌─────────────────────┐
│   React Frontend    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐      ┌─────────────────────┐
│   API Gateway       │◄────►│    Auth Service     │
└─────────┬───────────┘      └─────────┬───────────┘
          │                            │
          ▼                            ▼
┌─────────────────────┐      ┌─────────────────────┐
│  Spring Boot APIs   │◄────►│    Redis Cache      │
└─────────┬───────────┘      └─────────────────────┘
          │                            ▲
          ▼                            │
┌─────────────────────┐                │
│  MySQL Database     │────────────────┘
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Notification Service│
└─────────────────────┘

## Project Structure

Backend:
src/main/java/com/example/bookverse
 ├── config          # Configuration classes (CORS, Security, WebSocket, etc.)
 ├── controller      # REST API controllers
 ├── dto             # Request/Response DTOs
 ├── exception       # Custom exceptions and handlers
 ├── model           # JPA Entities
 ├── repository      # Spring Data JPA Repositories
 ├── security        # JWT filters, authentication, authorization
 ├── service         # Business logic services
 └── BookVerseApplication.java  # Main Spring Boot App

Frontend:
project-bolt/project/src
 ├── components      # Reusable UI components
 ├── config          # Configuration settings
 ├── context         # React context providers
 ├── hooks           # Custom React hooks
 ├── pages           # Page components
 ├── services        # API service functions
 └── types           # TypeScript type definitions

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Java 17
- MySQL
- Redis (optional, for caching)

### Backend Setup

1. Configure database properties in `src/main/resources/application.yml`:

   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/eventdb
       username: root
       password: admin
   ```

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

   VITE_API_URL=<http://localhost:8080/api>
   VITE_WEBSOCKET_URL=<http://localhost:8080/api/ws>
   VITE_RAZORPAY_KEY_ID=your_test_key_here

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

### Search Functionality

1. Basic search with simple query parameter
  
   GET /api/events/search?query={searchTerm}

2. Advanced search with multiple filters:

   GET /api/events/search?query={searchTerm}&category={category}&location={location}&startDate={date}&endDate={date}&minPrice={price}&maxPrice={price}&status={status}

3. Real-time search suggestions as user types
4. Analytics tracking for search patterns to improve results

### Payment Integration

1. Backend creates a payment order via Razorpay API
2. Frontend displays the payment form using Razorpay SDK
3. Payment callbacks update the booking status

## API Endpoints

### Authentication

- `POST /api/auth/signin`: Login with username and password
- `POST /api/auth/signup`: Register new user account

### Events

- `GET /api/events`: Get all events
- `GET /api/events/{id}`: Get a specific event by ID
- `GET /api/events/category/{category}`: Get events by category
- `GET /api/events/search`: Search events with filters
- `POST /api/events`: Add a new event (Admin only)
- `PUT /api/events/{id}`: Update an event (Admin only)
- `DELETE /api/events/{id}`: Delete an event (Admin only)

### Notifications

- WebSocket: `/api/ws` - Connect to WebSocket
- `GET /api/notifications`: Get user notifications
- `POST /api/notifications/send`: Send a notification (Admin only)

### Newsletter

- `POST /api/newsletter/subscribe`: Subscribe to newsletter

### Payments

- `POST /api/payments/create-order`: Create a payment order
- `POST /api/payments/verify`: Verify payment success

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

## License

This project is licensed under the MIT License

## Backend Environment Variables (.env in root directory)

MYSQL_DATABASE=eventmanagement
MYSQL_USER=root
MYSQL_PASSWORD=admin
MYSQL_HOST=localhost
MYSQL_PORT=3306

## Redis Config

REDIS_HOST=localhost
REDIS_PORT=6379

## Email Configuration

EMAIL_USERNAME=<your-email@gmail.com>
EMAIL_PASSWORD=your-app-password

## JWT Configuration

JWT_SECRET=ZmQ0ZGI5NjQ0MDQwY2I4MjMxY2Y3ZmI3MjdhN2ZmMjNhODViOTg1ZGE0NTBjMGM4NDA5NzYxMjdjOWMwYWRmZTBlZjlhNGY3ZTg4Y2U3YTE1ODVkZDU5Y2Y3OGYwZWE1NzUzNWQ2YjFjZDc0NGMxZWU2MmQ3MjY1NzJmNTE0MzI=
JWT_EXPIRATION_MS=86400000

## Razorpay Keys

RAZORPAY_KEY_ID=rzp_test_yourkeyhere
RAZORPAY_KEY_SECRET=yoursecrethere

## Frontend Environment Variables (.env in project-bolt/project directory)

REACT_APP_API_URL=<http://localhost:8080/api>
REACT_APP_WS_URL=ws://localhost:8080/api/ws
REACT_APP_RAZORPAY_KEY_ID=rzp_test_yourkeyhere
REACT_APP_ENV=development
