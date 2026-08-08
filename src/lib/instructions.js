export function getInstructionSteps(instructions = "") {
    const steps = instructions
        .split(/\r?\n+|(?<=[.!?])\s+/)
        .map((step) => step.trim())
        .filter(Boolean);

    return steps.length > 0
        ? steps
        : ["Instructions are unavailable."];
}
