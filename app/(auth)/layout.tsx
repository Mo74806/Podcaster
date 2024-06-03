
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main>
        {/* main content */}
        {children}
    </main>
  );
}
