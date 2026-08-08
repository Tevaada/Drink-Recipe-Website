"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ALLOWED_GOALS = new Set([
    "Explore drinks",
    "Focus",
    "Recovery",
    "Hydration",
    "Alcohol-free",
]);

function textValue(value) {
    return typeof value === "string"
        ? value.trim()
        : "";
}

function passwordValue(value) {
    return typeof value === "string"
        ? value
        : "";
}

function isValidEmail(email) {
    return (
        email.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
}

function signUpErrorMessage(error) {
    const messages = {
        user_already_exists:
            "An account already exists for this email. Please log in instead.",
        email_exists:
            "An account already exists for this email. Please log in instead.",
        weak_password:
            "The password does not meet the account security requirements.",
        email_address_invalid:
            "Please enter a valid email address.",
        over_email_send_rate_limit:
            "Too many confirmation emails were requested. Please wait a few minutes and try again.",
        over_request_rate_limit:
            "Too many account requests were made. Please wait a few minutes and try again.",
        signup_disabled:
            "New account registration is currently disabled.",
        email_provider_disabled:
            "Email registration is currently disabled.",
    };

    return (
        messages[error?.code] ||
        "Unable to create the account. Check the Supabase authentication settings and try again."
    );
}

async function saveProfile(supabase, user) {
    const metadata = user.user_metadata || {};

    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            display_name:
                metadata.display_name ||
                user.email?.split("@")[0] ||
                "Member",
            wellness_goal:
                metadata.wellness_goal ||
                "Explore drinks",
            updated_at: new Date().toISOString(),
        });

    return error;
}


export async function signUpAccount(values) {
    const name = textValue(values?.name);
    const email = textValue(values?.email);
    const password = passwordValue(values?.password);
    const focusGoal = textValue(values?.focusGoal);

    if (!name) {
        return {
            error: "Please enter your name.",
        };
    }

    if (name.length > 80) {
        return {
            error: "Your name must be 80 characters or fewer.",
        };
    }

    if (!isValidEmail(email)) {
        return {
            error: "Please enter a valid email address.",
        };
    }

    if (password.length < 6 || password.length > 128) {
        return {
            error:
                "Your password must contain between 6 and 128 characters.",
        };
    }

    if (!ALLOWED_GOALS.has(focusGoal)) {
        return {
            error: "Please select a valid interest.",
        };
    }

    const supabase = await createClient();

    const { data, error } =
        await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: name,
                    wellness_goal: focusGoal,
                },
            },
        });

    if (error) {
        return {
            error: signUpErrorMessage(error),
        };
    }

    let profileWarning = "";

    if (data.session && data.user) {
        const profileError =
            await saveProfile(supabase, data.user);

        if (profileError) {
            profileWarning =
                " Profile details could not be synchronized yet.";
        }
    }

    return {
        success: true,
        needsEmailConfirmation: !data.session,
        message: (
            data.session
                ? "Your account was created successfully."
                : "Account created. Check your email to confirm your account."
        ) + profileWarning,
    };
}
export async function deleteAccount() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            error:
                "You must be logged in to delete your account.",
        };
    }

    const { error } = await supabase.rpc(
        "delete_account",
    );

    if (error) {
        return {
            error:
                "Your account could not be deleted. Please try again.",
        };
    }

    await supabase.auth.signOut();

    revalidatePath("/", "layout");

    return {
        success: true,
        message:
            "Your account and saved favorites were permanently deleted.",
    };
}

export async function loginAccount(values) {
    const email = textValue(values?.email);
    const password = passwordValue(values?.password);

    if (!isValidEmail(email)) {
        return {
            error: "Please enter a valid email address.",
        };
    }

    if (!password || password.length > 128) {
        return {
            error: "Please enter a valid password.",
        };
    }

    const supabase = await createClient();

    const { data, error } =
    await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (error) {
        return {
            error: "The email or password is incorrect.",
        };
    }

    let profileWarning = "";

    if (data.user) {
        const profileError =
            await saveProfile(supabase, data.user);

        if (profileError) {
            profileWarning =
                " Profile details could not be synchronized yet.";
        }
    }

    return {
        success: true,
        message:
            `You logged in successfully.${profileWarning}`,
    };
}

export async function updateProfile(values) {
    const displayName = textValue(values?.displayName);
    const wellnessGoal = textValue(values?.wellnessGoal);

    if (!displayName) {
        return {
            error: "Please enter your name.",
        };
    }

    if (displayName.length > 80) {
        return {
            error: "Your name must be 80 characters or fewer.",
        };
    }

    if (!ALLOWED_GOALS.has(wellnessGoal)) {
        return {
            error: "Please select a valid interest.",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            error: "You must be logged in to update your profile.",
        };
    }

    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            display_name: displayName,
            wellness_goal: wellnessGoal,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        return {
            error: "Your profile could not be updated.",
        };
    }

    revalidatePath("/member");

    return {
        success: true,
        message: "Your profile was updated successfully.",
    };
}

export async function logoutAccount() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return {
            error: "Unable to log out. Please try again.",
        };
    }

    revalidatePath("/", "layout");

    return {
        success: true,
    };
}
