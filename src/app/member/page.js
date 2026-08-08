import styles from "./page.module.css";
import MemberForm from "@/components/MemberForm/MemberForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Member Profile | Drink Recipe",
    description:
        "Create a drink-recipe profile and personalize your collection.",
};

export default async function MemberPage() {
    const supabase = await createClient();
    const {data: { user },} = await supabase.auth.getUser();

    if (user) {
        redirect("/account");
    }

    return (
        <div className={styles.page}>
            <section className={styles.introduction}>

                <span className={styles.eyebrow}>
                    Member profile
                </span>

                <h1>
                    Make your recipe collection personal
                </h1>

                <p>
                    Create a profile to organize favorites and receive
                    drink recommendations based on your interests.
                </p>

                <ul className={styles.benefits}>
                <li>
                    <span aria-hidden="true">✓</span>
                    Keep your favorite recipes organized
                </li>

                <li>
                    <span aria-hidden="true">✓</span>
                    Set your wellness or drink preference
                </li>

                <li>
                    <span aria-hidden="true">✓</span>
                    Access your collection from different devices later
                </li>
                </ul>
            </section>

            <section className={styles.formPanel}>
                <MemberForm />
            </section>
        </div>
    );
}
