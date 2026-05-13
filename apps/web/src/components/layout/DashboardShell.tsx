"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { labels } from "@/constants";
import { logout } from "@/features/auth/api/auth-api";

const Shell = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
`;

const Aside = styled.aside`
  border-right: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Brand = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  text-decoration: none;
  color: ${(p) => (p.$active ? p.theme.colors.text : p.theme.colors.muted)};
  background: ${(p) => (p.$active ? p.theme.colors.surfaceHover : "transparent")};
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.border : "transparent")};
  &:hover {
    color: ${(p) => p.theme.colors.text};
    background: ${(p) => p.theme.colors.surfaceHover};
  }
`;

const Main = styled.main`
  padding: 28px 32px 48px;
`;

const FooterNav = styled.div`
  margin-top: auto;
  padding-top: 24px;
`;

const LogoutBtn = styled.button`
  width: 100%;
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.danger};
    border-color: ${(p) => p.theme.colors.danger};
  }
`;

const links = [
  { href: "/dashboard", label: labels.nav.home },
  { href: "/suppliers", label: labels.nav.suppliers },
  { href: "/products", label: labels.nav.products },
  { href: "/employees", label: labels.nav.employees },
  { href: "/financial", label: labels.nav.financial },
  { href: "/services", label: labels.nav.services },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Shell>
      <Aside>
        <Brand>{labels.app.brand}</Brand>
        {links.map((l) => (
          <NavItem key={l.href} href={l.href} $active={pathname === l.href}>
            {l.label}
          </NavItem>
        ))}
        <FooterNav>
          <LogoutBtn
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            {labels.nav.logout}
          </LogoutBtn>
        </FooterNav>
      </Aside>
      <Main>{children}</Main>
    </Shell>
  );
}
