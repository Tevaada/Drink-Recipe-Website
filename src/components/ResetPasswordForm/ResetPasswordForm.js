"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/app/member/actions";
import styles from "./ResetPasswordForm.module.css";

export default function ResetPasswordForm() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const password = formData.get("password");
        const confirmation = formData.get("confirmation");

        setError("");
        setMessage("");

        if (password !== confirmation) {
            setError("The passwords do not match.");
            return;
        }

        setIsLoading(true);
        const result = await updatePassword({ password });
        setIsLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        setMessage(result.message);
        form.reset();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Choose a new password</h1>
            <p>Use between 6 and 128 characters.</p>

            <label>
                New password
                <input name="password" type="password" minLength={6} maxLength={128} autoComplete="new-password" required />
            </label>

            <label>
                Confirm password
                <input name="confirmation" type="password" minLength={6} maxLength={128} autoComplete="new-password" required />
            </label>

            {error && <p className={styles.error} role="alert">{error}</p>}
            {message && <p className={styles.success} role="status">{message}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update password"}
            </button>

            <Link href="/member">Return to member account</Link>
        </form>
    );
}
