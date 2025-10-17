# 🏥 CareZone.uz - Tibbiy Xizmatlar Platformasi

Modern Next.js platformasi shifokorlar, klinikalar va bemorlar uchun.

## 🎯 Live Preview

**Development Server:** https://3004-ieoymvxbf82knnvzm49ak-cbeee0f9.sandbox.novita.ai

**GitHub PR:** https://github.com/SanjarAbduraimov/carezone-frontend/pull/1

## ⚡ Tech Stack

### Backend
- **Database:** MongoDB + Mongoose
- **Authentication:** NextAuth.js
- **Authorization:** RBAC (Role-Based Access Control)
- **API:** RESTful Next.js API Routes
- **Validation:** Zod + Class Validator

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios with interceptors
- **UI Components:** Radix UI + Custom Components
- **Forms:** React Hook Form
- **Type Safety:** TypeScript

## 📁 Project Structure

```
app/
├── api/                    # Next.js API Routes
│   ├── doctors/           # Doctors CRUD
│   ├── clinics/           # Clinics CRUD
│   └── booking/           # Booking API
├── lib/
│   ├── db/                # MongoDB connection
│   ├── models/            # Mongoose models
│   ├── middleware/        # Auth, RBAC, Error handling
│   └── types/             # TypeScript types & enums
├── services/              # API client & services
├── hooks/                 # Custom React hooks
├── providers/             # Context providers
└── components/            # React components
```

## 🔐 RBAC System

### Roles
- **USER** - Oddiy foydalanuvchi
- **DOCTOR** - Shifokor
- **CLINIC_ADMIN** - Klinika administratori
- **EDITOR** - Kontent muharriri
- **ADMIN** - Administrator
- **SUPER_ADMIN** - Super administrator

### Permissions
20+ granular permissions for fine-grained access control:
- User management
- Doctor profiles
- Clinic management
- Booking operations
- Review moderation
- Blog publishing
- Admin access

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB 6+
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/SanjarAbduraimov/carezone-frontend.git
cd carezone-frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Start MongoDB (local or Docker)
# docker run -d -p 27017:27017 --name mongodb mongo:latest

# Run development server
npm run dev
```

### Environment Variables

```env
# MongoDB
MONGODB_URI="mongodb://localhost:27017/carezone"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASS="password"
```

## 📚 API Documentation

### Doctors API

#### Get All Doctors
```bash
GET /api/doctors?page=1&limit=10&search=kardio
```

Response:
```json
{
  "success": true,
  "data": {
    "doctors": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### Get Single Doctor
```bash
GET /api/doctors/[slug]
```

#### Create Doctor (Auth required)
```bash
POST /api/doctors
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "slug": "john-doe",
  "specialtyIds": ["..."],
  "bio": "...",
  "yearsOfExp": 10
}
```

#### Update Doctor (Auth + Permission required)
```bash
PUT /api/doctors/[slug]
```

#### Delete Doctor (Admin only)
```bash
DELETE /api/doctors/[slug]
```

## 🎣 Frontend Hooks Usage

### Using TanStack Query Hooks

```tsx
'use client';
import { useDoctors, useDoctor, useCreateDoctor } from '@/app/hooks/useDoctors';

function DoctorsPage() {
  // Fetch doctors list with pagination
  const { data, isLoading, error } = useDoctors({ 
    page: 1, 
    limit: 10,
    search: 'kardio' 
  });

  // Fetch single doctor
  const { data: doctor } = useDoctor('john-doe');

  // Create mutation
  const createMutation = useCreateDoctor();

  const handleCreate = () => {
    createMutation.mutate({
      firstName: 'Jane',
      lastName: 'Smith',
      slug: 'jane-smith',
      // ...
    });
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data?.doctors.map(doctor => (
        <div key={doctor.id}>{doctor.fullName}</div>
      ))}
    </div>
  );
}
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🏗️ Architecture Highlights

### API Client
- Centralized Axios instance
- Request/Response interceptors
- Automatic error handling
- Type-safe responses

### Service Layer
- Separation of concerns
- Reusable API methods
- Easy to test and mock

### Custom Hooks
- Query key management
- Automatic cache invalidation
- Optimistic updates
- Pagination support

### Middleware
- Authentication checking
- Role-based authorization
- Permission validation
- Error handling

### Models
- Mongoose schemas with TypeScript
- Virtual fields
- Indexes for performance
- Text search support

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Permission-based authorization
- ✅ Password hashing (bcrypt)
- ✅ SQL injection protection (Mongoose)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting (planned)

## 🎨 UI/UX Features

- ✅ Responsive design
- ✅ Modern and clean interface
- ✅ Loading states
- ✅ Error handling
- ✅ Optimistic updates
- ✅ Search and filtering
- ✅ Pagination
- ✅ Toast notifications (planned)

## 📦 Key Dependencies

```json
{
  "mongoose": "^8.19.1",
  "@tanstack/react-query": "^5.90.5",
  "next": "15.5.4",
  "react": "19.1.0",
  "axios": "^1.12.2",
  "next-auth": "^4.24.11",
  "zod": "^4.1.12",
  "tailwindcss": "^4"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 👤 Author

**Sanjar Abduraimov**
- Telegram: [@SanjarAbduraimov](https://t.me/SanjarAbduraimov)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TanStack Query for powerful data fetching
- Mongoose team for the excellent ODM
- Vercel for hosting solutions

---

**Note:** This is a development preview. For production deployment, ensure:
- MongoDB is properly configured
- Environment variables are set
- Security measures are in place
- Rate limiting is enabled
- Monitoring is setup
