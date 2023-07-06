import { useStateAction } from "../../../../../../StateAction";

//TODO map animation broken
const [stateAction, { toggleAltimetryAnimation }] = useStateAction();

export default function () {
  return (
    <div>
      <input
        id="animation-setting"
        type="checkbox"
        class="mr-2"
        value="animation"
        checked={stateAction.altimetry.animation}
        onChange={() => {
          toggleAltimetryAnimation();
        }}
      />
      <label for="animation-setting">Animations</label>
    </div>
  );
}
