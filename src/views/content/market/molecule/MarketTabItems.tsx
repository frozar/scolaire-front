import Button from "../../../../component/atom/Button";
import {
  MarketTabEnum,
  currentMarketTab,
  setCurrentMarketTab,
} from "../organism/Market";
import "./MarketTabItems.css";

export function MarketTabitems() {
  function setSelectedTab(tab: MarketTabEnum) {
    setCurrentMarketTab(tab);
  }

  return (
    <div class="market-tab-items">
      <Button
        label="Véhicules"
        onClick={() => setSelectedTab(MarketTabEnum.vehicles)}
        active={currentMarketTab() == MarketTabEnum.vehicles}
        variant="outline"
        size="3xl"
      />

      <Button
        label="Allotissement"
        onClick={() => setSelectedTab(MarketTabEnum.allotment)}
        active={currentMarketTab() == MarketTabEnum.allotment}
        variant="outline"
        size="3xl"
      />
    </div>
  );
}
