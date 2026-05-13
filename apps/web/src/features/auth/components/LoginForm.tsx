"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth-api";
import { labels } from "@/constants";
import {
  AuthShell,
  AuthCard,
  AuthTitle,
  AuthSubtitle,
  Field,
  Input,
  PrimaryButton,
  GhostButton,
  ErrorText,
} from "./AuthLayout";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: () => router.push("/dashboard"),
  });

  return (
    <AuthShell>
      <AuthCard>
        <AuthTitle>{labels.auth.loginTitle}</AuthTitle>
        <AuthSubtitle>{labels.auth.loginSubtitle}</AuthSubtitle>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        <Field>
          {labels.common.email}
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.auth.placeholderEmail}
          />
        </Field>
        <Field>
          {labels.common.password}
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={labels.auth.placeholderPasswordMask}
          />
        </Field>
        <PrimaryButton
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? labels.auth.loggingIn : labels.auth.loginSubmit}
        </PrimaryButton>
        <GhostButton type="button" onClick={() => router.push("/register")}>
          {labels.auth.createUser}
        </GhostButton>
      </AuthCard>
    </AuthShell>
  );
}
