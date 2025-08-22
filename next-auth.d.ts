/* eslint-disable @typescript-eslint/no-unused-vars */
// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: "USER" | "EMPLOYEE" | "BARBER"
    }
  }
  interface User {
    id: string
    role: "USER" | "EMPLOYEE" | "BARBER"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "USER" | "EMPLOYEE" | "BARBER"
  }
}
