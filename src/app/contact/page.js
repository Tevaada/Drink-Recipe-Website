import ContactForm from "@/components/ContactForm/ContactForm";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export const metadata = {
    title: "Contact Us | Drink Recipe",
    description:
        "Send a message to the Drink Recipe team.",
};

export default async function ContactPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let displayName = "";

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .maybeSingle();

        displayName =
            profile?.display_name ||
            user.user_metadata?.display_name ||
            "";
    }

    return (
        <div className={styles.page}>
            <section className={styles.introduction}>
                <span className={styles.eyebrow}>
                    Contact us
                </span>

                <h1>We would love to hear from you</h1>

                <p>
                    Have a question, suggestion or recipe
                    idea? Complete the form and send us a
                    message.
                </p>

                <div className={styles.information}>
                    <div>
                        <strong>Response time</strong>
                        <span>
                            Usually within two business days
                        </span>
                    </div>

                    <div>
                        <strong>What to share</strong>
                        <span>
                            Questions, feedback or drink ideas
                        </span>
                    </div>
                </div>
            </section>

            <section
                className={styles.formPanel}
                aria-label="Contact form"
            >
                {user ? (
                    <ContactForm
                        initialName={displayName}
                        email={user.email || ""}
                    />
                ) : (
                    <div className={styles.memberNotice}>
                        <span>Member access</span>
                        <h2>Sign in to send a message</h2>
                        <p>
                            Contact submissions are available to registered
                            Drink Recipe members only.
                        </p>
                        <Link href="/member">Sign up or log in</Link>
                    </div>
                )}
            </section>
        </div>
    );
}
