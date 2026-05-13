"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/auth-api";
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
        <AuthTitle>Criar conta</AuthTitle>
        <AuthSubtitle>Preencha os dados para cadastrar um novo usuário.</AuthSubtitle>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        <Field>
          Nome
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
        </Field>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </Field>
        <PrimaryButton
          type="button"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Criando…" : "Cadastrar"}
        </PrimaryButton>
        <GhostButton type="button" onClick={() => router.push("/login")}>
          Já tenho conta
        </GhostButton>
      </AuthCard>
    </AuthShell>
  );
}
