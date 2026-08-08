import ContactForm from "@/components/ContactForm/ContactForm";
import styles from "./page.module.css";

export const metadata = {
    title: "Contact Us | Drink Recipe",
    description:
        "Send a message to the Drink Recipe team.",
};

export default function ContactPage() {
    return (
        <main className={styles.page}>
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
                <ContactForm />
            </section>
        </main>
    );
}
