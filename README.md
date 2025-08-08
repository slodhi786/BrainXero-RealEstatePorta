# RealEstate Portal – Backend API

A modern **.NET 9 Web API** for a real estate portal with authentication, property search, favorites, seeding, and automated tests.

---

## 📌 Features

- **JWT Authentication** (Register/Login)
- **Property Management**
  - CRUD
  - Search with multiple filters
  - Pagination & Sorting
- **Favorites** per user
- **Database Seeding** with realistic Unsplash images
- **Global Error Handling** & Validation
- **Swagger / OpenAPI Documentation**
- **Unit Tests** with xUnit + EF Core InMemory

---

## 🛠 Tech Stack

- **.NET 9** (C#, ASP.NET Core Web API)
- **EF Core 9** (Code-First, SQL Server)
- **ASP.NET Core Identity**
- **AutoMapper**
- **xUnit** for testing
- **Swagger** (Swashbuckle)

---

## 📂 Solution Structure

```
RealEstatePortal/
├── RealEstate.Presentation.WebApi/        # API project (controllers, Program.cs)
├── RealEstate.Application/                # DTOs, services, mapping profiles
├── RealEstate.Domain/                      # Entities, enums
├── RealEstate.Infrastructure.Persistence/  # DbContext, EF configs, migrations
├── RealEstate.Infrastructure.Common/       # Middleware, helpers
├── RealEstate.SharedKernel/                 # Shared utilities
└── RealEstate.Tests.Unit/                   # Unit tests
```

---

## ⚡ Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or Express works)
- [Postman](https://www.postman.com/) (optional for API testing)

---

## 🚀 Getting Started

### 1️⃣ Clone & Restore
```powershell
git clone <your-repo-url>
cd RealEstatePortal
dotnet restore
```

### 2️⃣ Configure Database & JWT
Create/update `RealEstate.Presentation.WebApi/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DbConnection": "Server=localhost;Database=RealEstatePortalDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "super_secret_key_123456_replace_me",
    "Issuer": "RealEstateAPI",
    "Audience": "RealEstateAPIUsers",
    "ExpiresInMinutes": 60
  }
}
```

### 3️⃣ Run Migrations
```powershell
# Add migration (only if schema changes)
dotnet ef migrations add InitialCreate `
  --project RealEstate.Infrastructure.Persistence `
  --startup-project RealEstate.Presentation.WebApi

# Apply migrations
dotnet ef database update `
  --project RealEstate.Infrastructure.Persistence `
  --startup-project RealEstate.Presentation.WebApi
```

### 4️⃣ Run the API
```powershell
dotnet run --project .\RealEstate.Presentation.WebApi\
```

Swagger UI (dev):  
👉 `https://localhost:<port>/swagger`

---

## 🧪 Running Tests
```powershell
dotnet test .\RealEstate.Tests.Unit\RealEstate.Tests.Unit.csproj
```

Tests cover:
- PropertyService (create, list, search/pagination)
- FavoriteService (add, remove, get)
- AutoMapper configuration

---

## 📡 API Overview

### Auth
| Method | Endpoint              | Auth? | Description |
|--------|-----------------------|-------|-------------|
| POST   | `/api/auth/register`  | ❌    | Register new user |
| POST   | `/api/auth/login`     | ❌    | Login and get JWT |

### Properties
| Method | Endpoint                | Auth? | Description |
|--------|-------------------------|-------|-------------|
| GET    | `/api/property`         | ❌    | Get paged/sorted list (`page`, `pageSize`, `sortBy`, `sortOrder`) |
| GET    | `/api/property/{id}`    | ❌    | Get property details |
| POST   | `/api/property/search`  | ❌    | Search with filters |
| POST   | `/api/property`         | ✅    | Create new property |
| PUT    | `/api/property/{id}`    | ✅    | Update property |
| DELETE | `/api/property/{id}`    | ✅    | Delete property |

### Favorites
| Method | Endpoint                          | Auth? | Description |
|--------|------------------------------------|-------|-------------|
| GET    | `/api/favorites`                   | ✅    | List favorites |
| POST   | `/api/favorites/add/{propertyId}`  | ✅    | Add property to favorites |
| DELETE | `/api/favorites/remove/{propertyId}`| ✅    | Remove property from favorites |

**Auth header**: `Authorization: Bearer <token>`

---

## 🔍 Search Parameters
POST `/api/property/search` body example:
```json
{
  "title": "Luxury",
  "address": "Main Street",
  "city": "Karachi",
  "minPrice": 5000000,
  "maxPrice": 20000000,
  "bedrooms": 3,
  "bathrooms": 2
}
```

---

## 📜 Example Workflows

1️⃣ **Register → Login → Use JWT**
```http
POST /api/auth/register
POST /api/auth/login
Authorization: Bearer <token>
```

2️⃣ **Get properties**
```http
GET /api/property?page=1&pageSize=5&sortBy=price&sortOrder=asc
```

3️⃣ **Add favorite**
```http
POST /api/favorites/add/8f9a6d60-8b1a-4f1d-b17f-4e76dbf77b15
Authorization: Bearer <token>
```

---

## 🗄 EF Core Handy Commands

```powershell
# Add migration
dotnet ef migrations add <Name> `
  --project RealEstate.Infrastructure.Persistence `
  --startup-project RealEstate.Presentation.WebApi

# Update DB
dotnet ef database update `
  --project RealEstate.Infrastructure.Persistence `
  --startup-project RealEstate.Presentation.WebApi

# Drop DB (dev only)
dotnet ef database drop `
  --project RealEstate.Infrastructure.Persistence `
  --startup-project RealEstate.Presentation.WebApi --force
```

(Optional scripts if you added them):
- `reset-db.ps1` → drop + recreate + seed
- `update-db.ps1` → add optional migration + update

---

## 🌐 Swagger / OpenAPI

Install (if not already):
```powershell
dotnet add .\RealEstate.Presentation.WebApi\RealEstate.Presentation.WebApi.csproj package Swashbuckle.AspNetCore
```

Enable in `Program.cs`:
```csharp
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(/* XML + JWT security */);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
```

Enable XML docs in WebApi `.csproj`:
```xml
<PropertyGroup>
  <TargetFramework>net9.0</TargetFramework>
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
```

---

## 🔒 CORS (Frontend Friendly)
```csharp
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
app.UseCors();
```

---

## 🐞 Troubleshooting

- **401 Unauthorized** → Ensure JWT is included: `Authorization: Bearer <token>`
- **No data** → Run migrations & ensure seeding executes on startup
- **SQL error** → Update `DbConnection` in `appsettings.Development.json`

---

## 📄 License
MIT
