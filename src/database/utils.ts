
import { format } from 'mysql2';

const likeSpecialChars = /[\!\%\_\[]/g;

export const escapeChar = '!' as const;

/**
 * Escapes a string for use in a LIKE search pattern, using "!" as the escape character
 */
export const escapeLikePattern = (pattern: string) => {
	return pattern.replace(likeSpecialChars, (char) => escapeChar + char);
};

/**
 * Returns an value expression for a given optional column for a PATCH operation. A null
 * value will result in setting the value to null, where as an undefined value will
 * keep the value existing in the column already. Any other value just sets the value.
 *
 * @param column The name of the column being updated
 * @param value The new value to be assigned
 */
export const value = (column: string, value: any) => {
	if (value === void 0) {
		return column;
	}

	if (value === null) {
		return null;
	}

	return format('?', [ value ]);
};
