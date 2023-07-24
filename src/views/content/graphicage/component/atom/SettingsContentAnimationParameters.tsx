import { useStateAction } from "../../../../../StateAction";

import "./SettingsContentAnimationParameters.css";

const [, { toggleAltimetryAnimation, getAnimationSettings }] = useStateAction();

export function SettingsContentAnimationParameters(){
    return(
      <div class="settings-content-animation-parameter">
        <input
          id="settings-content-animation-parameter"
          type="checkbox"
          value="animation"
          checked={getAnimationSettings()}
          onChange={() => {
            toggleAltimetryAnimation();
          }}
        />
        <label for="settings-content-animation-parameter">Animations</label>
      </div>
    );
}