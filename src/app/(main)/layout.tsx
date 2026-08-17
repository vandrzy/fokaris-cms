import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { TextProvider } from "@/context/TextContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TextProvider>
      <Navbar />
      {children}
      <Footer />
    </TextProvider>
  );
}
