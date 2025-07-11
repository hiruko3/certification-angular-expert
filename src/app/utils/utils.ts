/**
 * Create a frequency map of string.
 * We count how many times each string appears in the array.
 * @param array the array of strings to create a frequency map from
 * @private
 */
export function createFrequencyMap(array: string[]): Map<string, number> {
    return array.reduce((map: Map<string, number>, value: string): Map<string, number> => map.set(value, (map.get(value) || 0) + 1), new Map<string, number>());
}
