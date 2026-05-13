"use client";

import { labels } from "@/constants";
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
      <Title>{labels.dashboard.welcomeTitle}</Title>
      <Lead>{labels.dashboard.welcomeLead}</Lead>
    </Hero>
  );
}
