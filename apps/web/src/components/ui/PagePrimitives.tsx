"use client";

import styled from "styled-components";

export const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.35rem;
`;

export const PageSubtitle = styled.p`
  margin: 0 0 24px;
  color: ${(p) => p.theme.colors.muted};
`;

export const Panel = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.theme.colors.surface};
  padding: 20px;
  margin-bottom: 20px;
`;

export const PanelTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  align-items: end;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const TextInput = styled.input`
  padding: 8px 10px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.bg};
  color: ${(p) => p.theme.colors.text};
`;

export const SelectInput = styled.select`
  padding: 8px 10px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.bg};
  color: ${(p) => p.theme.colors.text};
`;

export const SmallButton = styled.button`
  padding: 8px 12px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: none;
  background: ${(p) => p.theme.colors.accent};
  color: white;
  font-weight: 600;
  cursor: pointer;
  height: 36px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  padding: 6px 10px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.danger};
  background: transparent;
  color: ${(p) => p.theme.colors.danger};
  cursor: pointer;
  font-size: 0.8rem;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.muted};
  font-weight: 500;
`;

export const Td = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const ErrorBanner = styled.div`
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.danger};
  color: ${(p) => p.theme.colors.danger};
  font-size: 0.9rem;
`;
