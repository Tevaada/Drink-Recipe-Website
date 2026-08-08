"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PreparationTimer.module.css";

export default function PreparationTimer() {
    const [minutes, setMinutes] = useState(5);
    const [remaining, setRemaining] = useState(300);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const totalSeconds = minutes * 60;

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setRemaining((current) => {
                if (current <= 1) {
                    window.clearInterval(
                        intervalRef.current,
                    );

                    setIsRunning(false);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    function resetTimer() {
        setIsRunning(false);
        setRemaining(minutes * 60);
    }

    function changeMinutes(event) {
        const nextMinutes = Math.max(
            1,
            Math.min(
                60,
                Number(event.target.value) || 5,
            ),
        );

        setMinutes(nextMinutes);
        setRemaining(nextMinutes * 60);
        setIsRunning(false);
    }

    function toggleTimer() {
        if (remaining === 0) {
            setRemaining(totalSeconds);
        }

        setIsRunning((current) => !current);
    }

    const formattedMinutes = String(
        Math.floor(remaining / 60),
    ).padStart(2, "0");

    const formattedSeconds = String(
        remaining % 60,
    ).padStart(2, "0");

    const progress = totalSeconds
        ? ((totalSeconds - remaining) /
              totalSeconds) *
          100
        : 0;

    return (
        <section
            className={styles.timer}
            aria-labelledby="timer-title"
        >
            <h2 id="timer-title">
                Preparation timer
            </h2>

            <p className={styles.help}>
                Choose the time you need for this recipe.
            </p>

            <label className={styles.setting}>
                Minutes

                <input
                    type="number"
                    min={1}
                    max={60}
                    value={minutes}
                    onChange={changeMinutes}
                />
            </label>

            <strong
                className={styles.display}
                aria-live="polite"
            >
                {formattedMinutes}:{formattedSeconds}
            </strong>

            <div
                className={styles.progress}
                aria-hidden="true"
            >
                <span
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>

            <div className={styles.actions}>
                <button type="button" onClick={toggleTimer}>
                    {isRunning
                        ? "Pause"
                        : remaining === 0
                          ? "Restart"
                          : "Start"}
                </button>

                <button
                    type="button"
                    onClick={resetTimer}
                >
                    Reset
                </button>
            </div>

            {remaining === 0 && (
                <p className={styles.complete} role="status">
                    Preparation time complete.
                </p>
            )}
        </section>
    );
}
