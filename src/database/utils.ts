
const likeSpecialChars = /[\!\%\_\[]/g;

export const escapeChar = '!' as const;

/**
 * Escapes a string for use in a LIKE search pattern, using "!" as the escape character
 */
export const escapeLikePattern = (pattern: string) => {
	return pattern.replace(likeSpecialChars, (char) => escapeChar + char);
};
