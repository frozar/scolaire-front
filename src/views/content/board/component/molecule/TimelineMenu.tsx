import { Show, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import { DotMenu } from "../../../../../icons/DotMenu";
import { TimelineWaitingTimeSetting } from "./TimelineWaitingTimeSetting";

import ButtonIcon from "./ButtonIcon";
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
      <ButtonIcon
        class={"timeline-open-menu-button " + (isOpenMenu() ? "active" : "")}
        icon={<DotMenu />}
        onClick={() => setIsOpenMenu((prev) => !prev)}
      />

      <Show when={isOpenMenu()}>
        <div class="menu">
          <Show
            when={!isOpenSetting()}
            fallback={
              <TimelineWaitingTimeSetting
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
