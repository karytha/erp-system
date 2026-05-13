"use client";

import styled from "styled-components";

const Hero = styled.div`
  max-width: 720px;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 1.6rem;
`;

const Lead = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export default function DashboardPage() {
  return (
    <Hero>
      <Title>Bem-vindo ao ERP</Title>
      <Lead>
        Use o menu lateral para acessar fornecedores, produtos, colaboradores, financeiro e serviços.
        Todas as operações são protegidas por autenticação e persistidas no PostgreSQL.
      </Lead>
    </Hero>
  );
}
