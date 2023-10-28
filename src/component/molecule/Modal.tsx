import { JSX, Show, children } from "solid-js";
import { Transition } from "solid-transition-group";

interface ModalProps {
  show: boolean;
  children: JSX.Element;
}

export default function (props: ModalProps) {
  const subComponent = children(() => props.children);

  return (
    <Transition
      name="slide-fade"
      enterActiveClass="ease-out duration-300"
      enterClass="opacity-0"
      enterToClass="opacity-100"
      exitActiveClass="ease-in duration-300"
      exitClass="opacity-100"
      exitToClass="opacity-0"
    >
      <Show when={props.show}>
        <div
          class="relative z-modal"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          {/* Forum github pour les nested transitions
          https://github.com/reactjs/react-transition-group/issues/558 */}
          <Transition
            name="slide-fade"
            enterActiveClass="ease-out duration-300"
            enterClass="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterToClass="opacity-100 translate-y-0 sm:scale-100"
            exitActiveClass="ease-in duration-200"
            exitClass="opacity-100 translate-y-0 sm:scale-100"
            exitToClass="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            appear
          >
            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="flex min-h-full items-center justify-center text-center">
                {subComponent()}
              </div>
            </div>
          </Transition>
        </div>
      </Show>
    </Transition>
  );
}
