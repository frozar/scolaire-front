import { createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../StateGui";
import { getAuthenticatedUser } from "../../signaux";
import DialogueBox from "./DialogueBox";

const [, { getSelectedMenu }] = useStateGui();

<<<<<<< HEAD
interface DialogueBoxProps {
  incMessage?: number;
}

export default function (props: DialogueBoxProps) {
=======
export default function () {
>>>>>>> aa5759bf (Add new componants :)
  const [previousSelectedMenu, setPreviousSelectedMenu] = createSignal("");
  const [incMessage, setIncMessage] = createSignal(0);

  createEffect(() => {
    if (getAuthenticatedUser()) {
      return;
    }

    if (getSelectedMenu() != previousSelectedMenu()) {
      setPreviousSelectedMenu(getSelectedMenu());
      setIncMessage((prev) => prev + 1);
    }
  });

  const userMessages = [
<<<<<<< HEAD
    "En haut, à droite, pour vous connecter",
=======
    "En haut, à droite, pour vous connectez",
>>>>>>> aa5759bf (Add new componants :)
    "Vous devriez vous connecter",
    "En haut, à droite, vous trouverez le bouton de connection",
  ];

<<<<<<< HEAD
  function mod(value: number, n: number) {
    return ((value % n) + n) % n;
  }

  const indexMessage = () => {
    if (props.incMessage !== null && props.incMessage !== undefined) {
      return mod(props.incMessage, 3);
    }

    return mod(incMessage(), 3);
  };
=======
  const indexMessage = () => incMessage() % 3;
>>>>>>> aa5759bf (Add new componants :)

  return (
    <DialogueBox>
      <div class="flex h-full items-center justify-center">
<<<<<<< HEAD
        <div class="text-2xl text-center">{userMessages[indexMessage()]}</div>
=======
        <div class="text-2xl">{userMessages[indexMessage()]}</div>
>>>>>>> aa5759bf (Add new componants :)
      </div>
    </DialogueBox>
  );
}
