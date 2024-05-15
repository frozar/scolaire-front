import { Show, createSignal } from "solid-js";
import { TripPointType } from "../../../../_entities/trip.entity";
import Button from "../../../../component/atom/Button";
import { DotMenu } from "../../../../icons/DotMenu";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineMenu.css";
import { TimelineWaitingTimeSetting } from "./TimelineWaitingTimeSetting";

interface TimelineMenuProps {
  onClickDeletePoint: () => void;
  onClickWaitingTime: (value: number) => void;
  point: TripPointType;
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
                waitingTime={props.point.waitingTime}
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
              label={"Quantité : " + props.point.name}
              onClick={() => setIsOpenSetting((prev) => !prev)}
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
