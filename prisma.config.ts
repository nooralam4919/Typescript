// /// <reference types="node" />

// import "dotenv/config";
// import { defineConfig } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",

//   datasource: {
//     url: process.env.DATABASE_URL!,
//   },
// });



import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(process.cwd(), "../.env"),
});

import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",

    migrations: {
        path: "prisma/migrations",
    },

    datasource: {
        url: env("DATABASE_URL"),
    },
});