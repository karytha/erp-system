import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import { AuthShell, AuthCard } from "./AuthLayout";

describe("AuthLayout", () => {
  it("renderiza shell e card com conteúdo", () => {
    render(
      <ThemeProvider theme={theme}>
        <AuthShell>
          <AuthCard>
            <p>Conteúdo do cartão</p>
          </AuthCard>
        </AuthShell>
      </ThemeProvider>,
    );

    expect(screen.getByText("Conteúdo do cartão")).toBeInTheDocument();
  });
});
