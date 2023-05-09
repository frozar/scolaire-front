// import { openExportConfirmationBox } from "../signaux";

import { openGeneratorDialogueBox } from "../signaux";

// import { onClickHandler } from "./generationCircuit";

export default function () {
  return (
    <>
      <div class="generate-btn">
        <button onClick={openGeneratorDialogueBox}>Generate</button>
      </div>
    </>
  );
}
