import { JSX, Show, children } from "solid-js";
import { Transition } from "solid-transition-group";

import "./UserInstructionContainer.css";

interface UserInstructionContainerProps {
  show: boolean;
  children: JSX.Element;
}

export default function (props: UserInstructionContainerProps) {
  const subComponent = children(() => props.children);

  return (
    <Show when={props.show}>
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
        <div id="instruction-container">{subComponent()}</div>
      </Transition>
    </Show>
  );
}
