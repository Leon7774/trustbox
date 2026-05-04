"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local[0]}****@${domain}`;
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  console.log(email, password);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  // 1. Check if email already exists in local DB to provide immediate feedback
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return { success: true, email, alreadyExists: true };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || "",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    // 2. Use upsert to handle cases where user might exist in Auth but not in our DB
    // or to ensure we don't create duplicates if the first check missed something.
    await db
      .insert(users)
      .values({
        anonymousId: data.user.id,
        email,
        fullName: name || "",
      })
      .onConflictDoUpdate({
        target: [users.anonymousId],
        set: {
          email,
          fullName: name || "",
        },
      });
  }

  revalidatePath("/", "layout");
  return { success: true, email, alreadyExists: false };
}

export async function resendConfirmationAction(email: string) {
  if (!email) return { error: "Email is required" };

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Check if user exists in our DB first
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!existingUser) {
    return { error: "This email is not registered. Please sign up first." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
