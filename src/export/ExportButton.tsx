import { openExportConfirmationBox } from "../signaux";

export default function () {
  return (
    <>
      <div class="export-btn">
        <button
          onClick={() => {
            openExportConfirmationBox();
          }}
        >
          Export
        </button>
      </div>
    </>
  );
}
