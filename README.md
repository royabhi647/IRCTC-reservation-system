# IRCTC (Railway Reseration System API)

The IRCTC (Railway Management System API) is designed to manage train bookings, allowing users to check train availability between stations, book seats, and manage train schedules. This API is built using Node.js and MySQL database management.

## Features

- User registration and authentication
- Role-based access control (Admins and regular users)
- Train management (Add, and check trains)
- Seat booking and availability checks
- Race condition handling using row versioning

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL

### Setting Up the Environment

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/royabhi647/IRCTC-reservation-system.git
   ```

2. Install the necessary npm packages:

   ```
   cd IRCTC-reservation-system
   npm install
   ```

3. Set up your MySQL project and obtain database Key. Update the `.env` file with your credentials and other environment variables:

   ```
   DB_HOST = localhost
   DB_USER = root
   DB_PASSWORD = your_password
   DB_NAME = your_db_name
   DB_PORT = port_no
   JWT_SECRET = your_jwt_secret
   ADMIN_API_KEY=random_string
   ```

### Running the API

Start the server with:

```
nodemon index.js
```

The API will be available at `http://localhost:{PORT}`.

## API Endpoints

### Users

- **POST /users/register**: Register a new user.
  - for registering a admin include the `ADMIN_API_KEY` in query params as `apiKey`
- **POST /users/login**: Log in a user.

` All the Train and Booking endpoints are protected, set the Authorization header = Bearer {Token sent while login} for accessing these endpoints.`

### Trains

- **POST /trains/add** (Admin only): Add a new train.
- **GET /trains/availability**: Check seat availability between two stations.

### Bookings

- **POST /bookings/book**: Book a seat on a train.
- **GET /bookings/details**: Get specific booking details.
- **GET /bookings/userBookings**: Get booking history of a user.
