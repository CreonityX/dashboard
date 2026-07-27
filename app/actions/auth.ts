"use server"

import { cookies } from "next/headers"

// Simple base64 encode/decode using standard JS for edge compatibility
function toBase64(str: string) {
  return Buffer.from(str).toString('base64')
}

export async function loginAction(email: string, password: string) {
  const CORRECT_PASSWORD = process.env.AUTH_PASSWORD || "Test12#$!!"
  const isValidEmail = ["test@creonity.com", "creator@creonity.com", "brand@creonity.com"].includes(email)

  if (isValidEmail && password === CORRECT_PASSWORD) {
    // Generate a simple token. For a production app, use JWT or iron-session.
    const token = toBase64(`${email}:${Date.now()}`);
    
    (await cookies()).set("creonity_auth", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    
    return { success: true }
  }
  
  return { success: false, error: "Invalid email or password." }
}

export async function logoutAction() {
  (await cookies()).delete("creonity_auth");
  return { success: true }
}
