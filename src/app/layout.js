import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Drink Recipe",
  description: "Discover and save delicious drink recipes.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerUser = user
    ? {
        id: user.id,
        displayName:
          user.user_metadata?.display_name?.trim() ||
          user.email?.split("@")[0] ||
          "Member",
      }
    : null;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Header
          key={headerUser?.id ?? "guest"}
          initialUser={headerUser}
        />
        
        <main>{children}</main>

        <Footer />
      </body>

  </html>
  );
}
