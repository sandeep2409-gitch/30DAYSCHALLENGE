import "./globals.css";

export const metadata = {
  title: "30-Days Web Apps Challenge | Personal Portfolio",
  description: "A developer dashboard showcasing 29 web applications built across 30 days using React, Vue, Svelte, Flask, WebSockets, Canvas, and Machine Learning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
