import { Match, Switch, createSignal } from "solid-js";
import { MarketTabitems } from "../molecule/MarketTabItems";
import { AllotmentTab } from "../molecule/allotment/AllotmentTab";
import { VehicleTab } from "../molecule/vehicle/VehicleTab";

export enum MarketTabEnum {
  vehicles,
  allotment,
}

export const [currentMarketTab, setCurrentMarketTab] =
  createSignal<MarketTabEnum>(MarketTabEnum.vehicles);

export function Market() {
  return (
    <div>
      <MarketTabitems />
      <div class="market-tab-container">
        <Switch>
          <Match when={currentMarketTab() == MarketTabEnum.vehicles}>
            <VehicleTab />
          </Match>
          <Match when={currentMarketTab() == MarketTabEnum.allotment}>
            <AllotmentTab />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
