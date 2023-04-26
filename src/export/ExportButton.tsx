import { openExportConfirmationBox } from "../signaux";

export default function () {
  return (
    <>
      <div class="fixed bottom-0 right-0 p-2 m-4 mr-1 z-[999]">
        <button
          class="bg-white bg-opacity-90 border-none text-black
          hover:bg-white font-bold py-2 px-4 rounded btn"
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
