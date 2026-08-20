import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;



// 1. PrismaClient
// import { PrismaClient } from "../generated/prisma/client.js";

// PrismaClient is what you use in your backend to talk to your database.

// Instead of writing SQL like:

// INSERT INTO users (name, email, password)
// VALUES (...);

// you can write Prisma code like:

// await prisma.user.create({
//     data: {
//         name,
//         email,
//         password,
//     },
// });

// So think:

// PrismaClient
//      ↓
// Your TypeScript code
//      ↓
// PostgreSQL


// 2. PrismaPg
// import { PrismaPg } from "@prisma/adapter-pg";

// This is the PostgreSQL adapter.

// You're telling Prisma:

// "Use PostgreSQL to communicate with my database."

// The adapter connects Prisma's client to the PostgreSQL driver.

// 3. Creating the adapter
// const adapter = new PrismaPg({
//     connectionString: process.env.DATABASE_URL!,
// });

// This creates your PostgreSQL connection adapter.

// The important part is:

// process.env.DATABASE_URL

// This gets your database connection string from your .env file.