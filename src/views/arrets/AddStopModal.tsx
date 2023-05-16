import { CgCloseO } from "solid-icons/cg";

export default function (props: any) {
  const toggledModal = () => props.toggledModal();
  const toggleModal = () => props.toggleModal();

  return (
    <div id="stop-modal" classList={{ active: toggledModal() == true }}>
      <button onClick={toggleModal} class="h-[30px] w-[30px] ">
        <CgCloseO class="w-full h-full fill-green " />
      </button>
    </div>
  );
}
