import type { Requester } from "../../types";

/**
 * Transforms a requester into a standardized requester object.
 *
 * @param {any} requester The requester to transform. Can be a string, a user, or an object with
 *                        the keys `id`, `username`, and `avatarURL`.
 * @returns {Requester} The transformed requester object.
 */
export const requesterTransformer = (requester: any): Requester => {
    // if it's already the transformed requester
    if (typeof requester === "object" && "avatar" in requester && Object.keys(requester).length === 3) return requester as Requester;
    // if it's still a string
    if (typeof requester === "object" && "displayAvatarURL" in requester) {
        // it's a user
        return {
            id: requester.id,
            username: requester.username,
            avatarURL: requester.displayAvatarURL({ extension: "png" }),
            discriminator: requester.discriminator,
        };
    }
    return { id: requester!.toString(), username: "unknown" };
};
