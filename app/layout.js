import "./globals.css";
import CookieConsent from "./components/CookieConsent";

export const metadata = {
  title: "Lovelink",
  description: "Crie uma carta digital personalizada com fotos e música.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
