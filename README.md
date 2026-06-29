# Calendly Backend API

A RESTful backend service built with Node.js, Express, and TypeScript, utilizing Prisma as the ORM to connect to a PostgreSQL database. The project follows a modular, layered architecture pattern (Controller-Service-Repository) for maintainability and scalability.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma (using `@prisma/adapter-pg`)
* **Package Manager:** pnpm

## 📁 Project Structure

The codebase is organized into a clean layered architecture to separate concerns:

* `src/app.ts` & `src/server.ts`: Application configuration, Express setup, and the main server entry point.
* `src/routers/`: Defines the API routing logic (e.g., `user.router.ts`).
* `src/controllers/`: Handles incoming HTTP requests and structures the outbound responses.
* `src/services/`: Contains the core application business logic.
* `src/repositories/`: Manages direct database access and queries via the Prisma client.
* `src/config/`: Manages environment variables and the database connection initialization.
* `prisma/`: Contains the Prisma schema and database migrations.

## 🛠️ Setup & Installation

1. **Install Dependencies**
   Ensure you have `pnpm` installed, then run:
   ```bash
   pnpm install