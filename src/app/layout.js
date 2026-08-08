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

  let headerUser = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    headerUser = {
      id: user.id,
      displayName:
        profile?.display_name?.trim() ||
        user.user_metadata?.display_name?.trim() ||
        user.email?.split("@")[0] ||
        "Member",
    };
  }

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
