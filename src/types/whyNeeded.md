📝 Notes: Extending Express Request in TypeScript
1. The problem

Express's Request type does not normally have a userId property.

req.userId

TypeScript will give:

Property 'userId' does not exist on type 'Request'
2. Why this happens

Express already defines Request:

interface Request {
    body: any;
    params: any;
    query: any;
}

When your JWT middleware does:

req.userId = decoded.id;

TypeScript doesn't know what userId is.

3. Solution: Extend Express Request

Create:

src/types/express.d.ts

Add:

import "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export {};

This tells TypeScript:

Express Request also has an optional userId property.

4. Why userId?: string?

The ? means the property is optional.

userId?: string;

Before authentication:

req
 ├── body
 ├── params
 └── query

After JWT verification:

req
 ├── body
 ├── params
 ├── query
 └── userId ✅
5. JWT middleware

Your middleware verifies the token and adds the user ID:

const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
) as {
    id: string;
};

req.userId = decoded.id;

next();

Now controllers can access:

const userId = req.userId;
6. Important distinction

The .d.ts file does not create userId at runtime.

It only tells TypeScript that userId is allowed.

This actually creates it:

req.userId = decoded.id;
Flow to remember
Login
  ↓
JWT created
  ↓
JWT stored in cookie
  ↓
Request sent
  ↓
verifyJWT middleware
  ↓
JWT verified
  ↓
req.userId = decoded.id
  ↓
Controller uses req.userId

Key concept: This is called TypeScript declaration merging / module augmentation.