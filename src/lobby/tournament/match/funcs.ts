/**
 * Convert a float 0-1 to a percentage string 0-100%
 * @param num Partial number
 * @param total Total number
 * @returns {string} Percentage string
 */
export const getPercentage = (num: number, total: number): string => {
    if (total < 1) {
        return "0%";
    }
    return Math.floor(num * 100 / total) + "%";
};

/**
 * Round a number to the nearest integer and return an int
 * @param time Float number
 * @returns {number} Int
 */
export const round = (time: number): number => {
    return Math.round(time * 100) / 100;
};
