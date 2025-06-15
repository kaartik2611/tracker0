"use server";
import users from "@/app/lib/users.json";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import { User } from "@/generated/prisma";

type FormState = {
  errorMessage?: string;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function authenticate(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  "use server";
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const validate = loginSchema.safeParse({
    email,
    password,
  });

  if (!validate.success) {
    return {
      errorMessage: validate.error.errors.map((e) => e.message).join(", "),
    };
  }

  if (!email || !password) {
    return {
      errorMessage: "Email and password are required.",
    };
  }

  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (foundUser) {
    await createSession(foundUser as User);
    return redirect("/dashboard?login=success");
  } else {
    return {
      errorMessage: "Invalid email or password.",
    };
  }
}

export const logout = async () => {
  await deleteSession();
  return redirect("/login");
};
