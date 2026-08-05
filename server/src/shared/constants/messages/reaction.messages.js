const REACTION_MESSAGES = {

    REACTION_SUCCESS: (target) =>
        `${target.charAt(0).toUpperCase() + target.slice(1).toLowerCase()} reacted successfully`,

    REACTION_REMOVE_SUCCESS: (target) =>
        `${target.charAt(0).toUpperCase() + target.slice(1).toLowerCase()} reaction removed successfully`,

    INVALID_TARGET_TYPE:
        "Invalid target type",

    INVALID_TARGET_ID: (target) =>
        `Invalid ${target.toLowerCase()} ID`,

    TARGET_NOT_FOUND: (target) =>
        `${target.charAt(0).toUpperCase() + target.slice(1).toLowerCase()} not found`,

    ALREADY_REACTED: (target) =>
        `You have already reacted to this ${target.toLowerCase()}`,

    NOT_REACTED: (target) =>
        `You have not reacted to this ${target.toLowerCase()}`,
};

export default REACTION_MESSAGES;