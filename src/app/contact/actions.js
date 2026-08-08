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
    const message = textValue(values?.message);
    const website = textValue(values?.website);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        return { error: "Please sign up or log in before sending a message." };
    }

    const email = user.email.trim().toLowerCase();

    if (website) {
        return {
            success: true,
            message: "Thank you. Your message has been received.",
        };
    }

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

    const { data: wasSubmitted, error } =
        await supabase.rpc("submit_contact_message", {
            submitter_name: name,
            submitter_email: email,
            submitted_message: message,
        });

    if (error) {
        return {
            error: "We could not send your message right now. Please try again in a few minutes.",
        };
    }

    if (!wasSubmitted) {
        return {
            error:
                "Please wait a few minutes before sending another message.",
        };
    }

    return {
        success: true,
        message: "Thank you. Your message has been received.",
    };
}
