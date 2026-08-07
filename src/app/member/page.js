import styles from "./page.module.css";
import MemberForm from "@/components/MemberForm/MemberForm";
import MemberAccount from "@/components/MemberAccount/MemberAccount";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
    title: "Member Profile | Drink Recipe",
    description:
        "Create a drink-recipe profile and personalize your collection.",
};

export default async function MemberPage() {
    const supabase = await createClient();
    const {data: { user },} = await supabase.auth.getUser();
    
    let profile = null;

    if (user) {
        const { data } = await supabase
            .from("profiles")
            .select("display_name, wellness_goal")
            .eq("id", user.id)
            .maybeSingle();

        profile = data;
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
                {user ? (
                    <MemberAccount
                        user={user}
                        profile={profile}
                    />
                ) : (
                    <MemberForm />
                )}
            </section>
        </div>
    );
}