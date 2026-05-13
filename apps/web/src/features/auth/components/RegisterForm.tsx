"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/auth-api";
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

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => registerRequest(email, password, name),
    onSuccess: () => router.push("/dashboard"),
  });

  return (
    <AuthShell>
      <AuthCard>
        <AuthTitle>{labels.auth.registerTitle}</AuthTitle>
        <AuthSubtitle>{labels.auth.registerSubtitle}</AuthSubtitle>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        <Field>
          {labels.common.name}
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={labels.auth.placeholderName}
          />
        </Field>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={labels.auth.placeholderPasswordMin}
          />
        </Field>
        <PrimaryButton
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? labels.auth.creating : labels.auth.registerSubmit}
        </PrimaryButton>
        <GhostButton type="button" onClick={() => router.push("/login")}>
          {labels.auth.hasAccount}
        </GhostButton>
      </AuthCard>
    </AuthShell>
  );
}
