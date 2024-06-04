import { Match, Show, Switch, createSignal } from "solid-js";
import { GradeTripType } from "../../../../_entities/grade.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import Button from "../../../../component/atom/Button";
import { DotMenu } from "../../../../icons/DotMenu";
import { NatureEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineMenu.css";
import { TimelineQuantitySetting } from "./TimelineQuantitySetting";
import { TimelineWaitingTimeSetting } from "./TimelineWaitingTimeSetting";

enum TimelineMenuSettingView {
  timeWaiting,
  quantity,
}

export function TimelineMenu(props: {
  onClickDeletePoint: () => void;
  onClickWaitingTime: (value: number) => void;
  updateQuantity: (value: GradeTripType[]) => void;
  point: TripPointType;
  trip: TripType;
}) {
  const [isOpenMenu, setIsOpenMenu] = createSignal(false);
  const [isOpenSetting, setIsOpenSetting] = createSignal<
    TimelineMenuSettingView | boolean
  >(false);

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
              <Switch>
                <Match
                  when={isOpenSetting() == TimelineMenuSettingView.timeWaiting}
                >
                  <TimelineWaitingTimeSetting
                    closeSettings={() => setIsOpenSetting(false)}
                    waitingTime={props.point.waitingTime}
                    onClickWaitingTime={props.onClickWaitingTime}
                  />
                </Match>
                <Match
                  when={isOpenSetting() == TimelineMenuSettingView.quantity}
                >
                  <TimelineQuantitySetting
                    closeSettings={() => setIsOpenSetting(false)}
                    updateQuantity={props.updateQuantity}
                    point={props.point}
                    trip={props.trip}
                  />
                </Match>
              </Switch>
            }
          >
            <Button
              label="Supprimer"
              variant="danger"
              onClick={props.onClickDeletePoint}
            />
            <Show when={props.point.nature == NatureEnum.stop}>
              <Button
                label={"Quantité : " + props.point.name}
                onClick={() =>
                  setIsOpenSetting(TimelineMenuSettingView.quantity)
                }
              />
            </Show>
            <Button
              label="Temps d'attente"
              onClick={() =>
                setIsOpenSetting(TimelineMenuSettingView.timeWaiting)
              }
            />
          </Show>
        </div>
      </Show>
    </div>
  );
}
