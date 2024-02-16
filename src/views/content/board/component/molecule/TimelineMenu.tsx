import { JSXElement, Show, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import { LabeledInputNumber } from "../../../../../component/molecule/LabeledInputNumber";
import { BackIcon } from "../../../../../icons/BackIcon";
import CheckIcon from "../../../../../icons/CheckIcon";
import { DotMenu } from "../../../../../icons/DotMenu";

import "./TimelineMenu.css";

interface TimelineMenuProps {
  onClickDeletePoint: () => void;
  onClickWaitingTime: (value: number) => void;
  waitingTime: number;
}

export function TimelineMenu(props: TimelineMenuProps) {
  const [isOpenMenu, setIsOpenMenu] = createSignal(false);
  const [isOpenSetting, setIsOpenSetting] = createSignal(false);

  return (
    <div class="timeline-menu">
      <button
        class="timeline-open-menu-button"
        classList={{
          active: isOpenMenu(),
        }}
        onClick={() => setIsOpenMenu((prev) => !prev)}
      >
        <DotMenu />
      </button>

      <Show when={isOpenMenu()}>
        <div class="menu">
          <Show
            when={!isOpenSetting()}
            fallback={
              <WaitingTimeSetting
                closeSettings={() => setIsOpenSetting((prev) => !prev)}
                waitingTime={props.waitingTime}
                onClickWaitingTime={props.onClickWaitingTime}
              />
            }
          >
            <Button
              label="Supprimer"
              variant="danger"
              onClick={props.onClickDeletePoint}
            />
            <Button
              label="Temps d'attente"
              onClick={() => setIsOpenSetting((prev) => !prev)}
            />
          </Show>
        </div>
      </Show>
    </div>
  );
}

interface WaitingTimeSetting {
  closeSettings: () => void;
  onClickWaitingTime: (value: number) => void;
  waitingTime: number;
}

function WaitingTimeSetting(props: WaitingTimeSetting): JSXElement {
  // eslint-disable-next-line solid/reactivity
  const [waitingTime, setWaitingTime] = createSignal(props.waitingTime);

  function onChangeWaitingTime(value: number) {
    setWaitingTime(value);
  }

  return (
    <div class="settings-menu">
      <div class="header-menu">
        <button class="back-icon" onClick={() => props.closeSettings()}>
          <BackIcon />
        </button>

        <button
          class="save-icon"
          onClick={() => props.onClickWaitingTime(waitingTime())}
        >
          <CheckIcon />
        </button>
      </div>

      <div class="content">
        <LabeledInputNumber
          label="Temps d'attente"
          onChange={(element) => onChangeWaitingTime(Number(element.value))}
          selector={{
            value: waitingTime(),
            disabled: false,
          }}
        />
      </div>
    </div>
  );
}
