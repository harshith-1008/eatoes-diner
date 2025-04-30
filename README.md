# Digital Diner - Online Food Ordering App

## 🔗 Deployed Site

[Live hosted link](https://eatoes-diner.vercel.app)

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- MongoDB (Menu Items)
- PostgreSQL (Users & Orders)
- JWT Authentication

### Frontend

- React.js
- Vite.js
- TailwindCSS

## Project Setup

### Backend Setup

1. **Clone the repository**:

```bash
git clone https://github.com/harshith-1008/eatoes-diner.git
cd eatoes-diner/backend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

   - Create a `.env` file inside `/backend` (see `.env.example` for reference)

4. **Run migrations** for Prisma (PostgreSQL):

```bash
npx prisma migrate dev --name init
```

5. **Start the backend server**:

```bash
npm run dev
```

Server will run at `http://localhost:4000`

### Frontend Setup

1. **Move to frontend directory**:

```bash
cd ../frontend
```

2. **Install frontend dependencies**:

```bash
npm install
```

3. **Configure frontend environment variables**:

   - Create a `.env` file inside `/frontend` (see `.env.example` for reference)

4. **Start the frontend server**:

```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

## Environment Files

### Backend `.env.example`

```env
PORT=4000
DATABASE_URL=your_postgresql_connection_url
DIRECT_URL=your_postgresql_direct_url
MONGODB_URI=your_mongodb_connection_url
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=3d
REFRESH_TOKEN_EXPIRY=7d

```

### Frontend `.env.example`

```env
VITE_BACKEND_URL=http://localhost:4000/api/v1
```

## Database Design Justification

This project uses a hybrid database approach—choosing the most suitable database for each type of data:

1. Menu Items – Stored in MongoDB

Menu items are often dynamic and flexible.
The structure of a menu item can vary, especially when you introduce things like add-ons, flavors, or seasonal items.
MongoDB is schema-less, making it a natural fit for this type of data.
It allows faster read/write operations for content that doesn't require relational integrity.

2. Users – Stored in PostgreSQL

User data (name, phone, password, role) is structured and consistent.
Authentication workflows require strict validation, constraints (e.g., unique phone numbers), and predictable relationships.
PostgreSQL supports these needs well and integrates cleanly with Prisma ORM.
Using a relational database also helps in enforcing security-related features such as data integrity and proper indexing.

3. Orders – Stored in PostgreSQL

Orders are transactional and closely tied to users.
Each order must be stored reliably with history, timestamps, and total amounts.
PostgreSQL provides the transactional guarantees needed to prevent data inconsistency (e.g., avoiding half-saved orders).
The foreign key relationship between User and Order is best handled in a relational setup.

## API Endpoints

| Endpoint                        | Method | Description                                          |
| ------------------------------- | ------ | ---------------------------------------------------- |
| `/api/v1/user/register`         | POST   | Register a new user                                  |
| `/api/v1/user/login`            | POST   | Login user and set cookies                           |
| `/api/v1/menu`                  | GET    | Fetch all menu items (optionally filter by category) |
| `/api/v1/menu?category=starter` | GET    | Fetch all menu items (optionally filter by category) |
| `/api/v1/menu/:id`              | GET    | Fetch single menu item                               |
| `/api/v1/menu/add`              | POST   | Add menu item (can be accessed through Postman)      |
| `/api/v1/menu/update/:id`       | POST   | Modify menu item (can be accessed through Postman)   |
| `/api/v1/order/create-order`    | POST   | Create a new order (Authenticated)                   |

| `/api/v1/order/orders` | GET | Get all orders of logged-in user |

JWT tokens are set automatically in cookies after login or register.

---

Made with ❤️ by Harshith
