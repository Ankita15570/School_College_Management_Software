import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Patil Software App",
  description: "A simple Patil Software app with authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {" "}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
