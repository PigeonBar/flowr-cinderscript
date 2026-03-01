import { displayMissilesAboveEnemies } from "./features/displayMissilesAboveEnemies";
import { modifyBaseFOV } from "./features/modifyBaseFov";
import { addPetalCraftPreview } from "./features/petalCraftPreview";
import { addRandomizedSquadCodes } from "./features/randomizedSquadCode";

// Run the full list of features here.
addPetalCraftPreview();
addRandomizedSquadCodes();
displayMissilesAboveEnemies();
modifyBaseFOV();