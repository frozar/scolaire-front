import { Match, Switch, createSignal } from "solid-js";
import { AllotmentTab } from "../molecule/AllotmentTab";
import { MarketTabitems } from "../molecule/MarketTabItems";
import { VehicleTab } from "../molecule/VehicleTab";

export enum MarketTabEnum {
  vehicles,
  allotment,
}

export const [currentMarketTab, setCurrentMarketTab] =
  createSignal<MarketTabEnum>(MarketTabEnum.vehicles);

export function Market() {
  return (
    <div class="page-layout">
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
