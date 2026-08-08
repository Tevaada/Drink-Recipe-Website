import { logoutAccount } from "@/app/member/actions";
import styles from "./MemberAccount.module.css";
import ProfileEditor from "@/components/ProfileEditor/ProfileEditor";
import DeleteAccountButton from "@/components/DeleteAccountButton/DeleteAccountButton";

export default function MemberAccount({user, profile,}) {
    const displayName =
    profile?.display_name ||
    user.user_metadata?.display_name ||
    "Member";

    const wellnessGoal =
        profile?.wellness_goal ||
        user.user_metadata?.wellness_goal ||
        "Explore drinks";

    return (
        <div className={styles.account}>
            <span className={styles.status}>
                Signed in
            </span>

            <div className={styles.heading}>
                <h2>Welcome, {displayName}</h2>

                <p className={styles.email}>
                    {user.email}
                </p>
                <p className={styles.goal}>
                    Main interest: {wellnessGoal}
                </p>
            </div>
            
            <ProfileEditor profile={profile} />

            <form action={logoutAccount}>
                <button
                    type="submit"
                    className={styles.logoutButton}
                >
                    Log out
                </button>
            </form>
            <DeleteAccountButton />
        </div>
    );
}