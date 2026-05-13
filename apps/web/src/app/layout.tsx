import type { Metadata } from "next";
import { labels } from "@/constants";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: labels.app.title,
  description: labels.app.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
