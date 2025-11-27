// middleware.ts
import { auth } from "@/auth"

export { auth }   // Edge middleware 用
export const config = { matcher: ["/courses/:path*", "/upload/:path*"] }