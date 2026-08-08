import Link from "next/link";
import { redirect } from "next/navigation";
import MemberAccount from "@/components/MemberAccount/MemberAccount";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export const metadata = {
    title: "My Account | Drink Recipe",
    description: "Manage your Drink Recipe profile and collection.",
};

export default async function AccountPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/member");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, wellness_goal")
        .eq("id", user.id)
        .maybeSingle();

    const displayName =
        profile?.display_name ||
        user.user_metadata?.display_name ||
        user.email?.split("@")[0] ||
        "Member";

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div>
                    <span className={styles.eyebrow}>My account</span>
                    <h1>Your recipe space</h1>
                    <p>
                        Welcome back, {displayName}. Manage your profile and
                        continue building your personal drink collection.
                    </p>
                </div>

                <Link href="/favorites" className={styles.collectionLink}>
                    View saved recipes <span aria-hidden="true">→</span>
                </Link>
            </header>

            <div className={styles.content}>
                <aside className={styles.summary}>
                    <span className={styles.avatar} aria-hidden="true">
                        {displayName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                        <strong>{displayName}</strong>
                        <span>{user.email}</span>
                    </div>

                    <nav aria-label="Account shortcuts">
                        <Link href="/favorites">The Vault</Link>
                        <Link href="/recipes">Discover recipes</Link>
                        <Link href="/contact">Contact us</Link>
                    </nav>
                </aside>

                <section className={styles.accountPanel} aria-label="Profile settings">
                    <MemberAccount user={user} profile={profile} />
                </section>
            </div>
        </div>
    );
}
