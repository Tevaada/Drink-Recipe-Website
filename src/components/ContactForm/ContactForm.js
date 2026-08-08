"use client";

import { useState } from "react";
import { submitContactMessage } from "@/app/contact/actions";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const values = {
            name: formData.get("name")?.trim(),
            email: formData.get("email")?.trim(),
            message: formData.get("message")?.trim(),
        };

        setMessage("");
        setIsError(false);
        setIsLoading(true);

        try {
            const result = await submitContactMessage(values);

            if (result.error) {
                setIsError(true);
                setMessage(result.error);
                return;
            }

            setMessage(result.message);
            form.reset();
        } catch {
            setIsError(true);
            setMessage("Your message could not be sent. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <div className={styles.field}>
                <label htmlFor="contact-name">
                    Name
                </label>

                <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-email">
                    Email
                </label>

                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={120}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="contact-message">
                    Message
                </label>

                <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    maxLength={1000}
                    required
                />
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
            >
                {isLoading ? "Sending..." : "Send message"}
            </button>

            {message && (
                <p
                    className={`${styles.message} ${isError ? styles.error : ""}`}
                    role={isError ? "alert" : "status"}
                >
                    {message}
                </p>
            )}
        </form>
    );
}
