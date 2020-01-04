
const escapeChar = '!' as const;

const likeSpecialChars = /[\!\%\_\[]/g;

/**
 * Escapes a string for use in a LIKE search pattern, using "!" as the escape character
 */
export const escapeLikePattern = (pattern: string) => {
	return pattern.replace(likeSpecialChars, (char) => escapeChar + char);
};
