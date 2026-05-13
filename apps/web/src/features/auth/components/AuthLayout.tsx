"use client";

import styled from "styled-components";

export const AuthShell = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 20%, #1e3a5f33, transparent 40%),
    radial-gradient(circle at 80% 0%, #3b82f633, transparent 35%), ${(p) => p.theme.colors.bg};
`;

export const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: 0 24px 80px #00000055;
`;

export const AuthTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const AuthSubtitle = styled.p`
  margin: 0 0 24px;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.95rem;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.bg};
  color: ${(p) => p.theme.colors.text};
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 1px ${(p) => p.theme.colors.accent};
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.accent};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background: ${(p) => p.theme.colors.accentHover};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`;

export const ErrorText = styled.p`
  margin: 0 0 12px;
  color: ${(p) => p.theme.colors.danger};
  font-size: 0.9rem;
`;
