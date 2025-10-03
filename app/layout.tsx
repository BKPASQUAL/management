"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          {children}
          <Toaster position="top-right" richColors />
        </Provider>
      </body>
    </html>
  );
}
