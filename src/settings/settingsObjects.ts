// This file stores certain objects to avoid issues with circular imports.

import type { BooleanOption } from "./settingsOptions";

/**
 * "Invert Attack" option, which can also be toggled using a hotkey in-game.
 */
export let invertAttackToggle: BooleanOption;

/**
 * "Invert Defend" option, which can also be toggled using a hotkey in-game.
 */
export let invertDefendToggle: BooleanOption;

/**
 * Inits {@linkcode invertAttackToggle} and {@linkcode invertDefendToggle}.
 */
export function initInvertToggles(
  atkToggle: BooleanOption, defToggle: BooleanOption
) {
  invertAttackToggle = atkToggle;
  invertDefendToggle = defToggle;
}