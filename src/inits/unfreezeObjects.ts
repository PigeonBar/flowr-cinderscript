/**
 * Unfreezes frozen objects that this script will need to modify.
 */
export function unfreezeObjects(): void {
  processGameMessageMap = {...processGameMessageMap};
  Colors.rarities = structuredClone(Colors.rarities);
}

/**
 * Refreezes frozen objects that this script has done modifying.
 */
export function refreezeObjects(): void {
  Object.freeze(processGameMessageMap);
}