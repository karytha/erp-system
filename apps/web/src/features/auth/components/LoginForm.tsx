"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/auth-api";
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
        <AuthTitle>Entrar no ERP</AuthTitle>
        <AuthSubtitle>Use seu e-mail e senha para acessar o sistema.</AuthSubtitle>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        <Field>
          E-mail
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
          />
        </Field>
        <Field>
          Senha
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <PrimaryButton
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Entrando…" : "Entrar"}
        </PrimaryButton>
        <GhostButton type="button" onClick={() => router.push("/register")}>
          Criar usuário
        </GhostButton>
      </AuthCard>
    </AuthShell>
  );
}
