import { createEffect, createSignal } from "solid-js";
import "../index.css";

export default function DisplayAddLineMessageContent() {
  // const [divRef, setDivRef] = createSignal<HTMLElement | undefined>();
  // let refDivMessage: HTMLDivElement | undefined;
  // createEffect(() => {
  //   divRef()?.addEventListener(
  //     "animationend",
  //     () => {
  //       refDivMessage?.parentElement?.parentElement?.remove();
  //     },
  //     false
  //   );
  // });
  return (
    <>
      <kbd class="kbd">Entrée</kbd> Sauvegarder
      <kbd class="kbd ml-2">Echap</kbd> Abandonner les modifications
    </>
  );
}

// <div>
// <div>
//   <kbd class="kbd">Entrée</kbd> Sauvegarder
//   <kbd class="kbd ml-2">Echap</kbd> Abandonner les modifications
// </div>
// </div>
