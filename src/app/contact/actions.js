"use server";

import { createClient } from "@/lib/supabase/server";

function textValue(value) {
    return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
    return (
        email.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
}

export async function submitContactMessage(values) {
    const name = textValue(values?.name);
    const email = textValue(values?.email).toLowerCase();
    const message = textValue(values?.message);

    if (!name || name.length > 80) {
        return { error: "Please enter a valid name." };
    }

    if (!isValidEmail(email)) {
        return { error: "Please enter a valid email address." };
    }

    if (!message || message.length > 1000) {
        return {
            error: "Please enter a message containing no more than 1000 characters.",
        };
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from("contact_messages")
        .insert({ name, email, message });

    if (error) {
        return {
            error: "Your message could not be sent. Please try again.",
        };
    }

    return {
        success: true,
        message: "Thank you. Your message has been received.",
    };
}
