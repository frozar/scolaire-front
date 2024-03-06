import { JSXElement } from "solid-js";
import "./ServiceTripCardMiddle.css";

export function ServiceTripCardMiddle(): JSXElement {
  return (
    <div>
      <div class="service-trip-card-middle-text-header">Plage de départ</div>
      <div class="service-trip-card-middle-text">--:-- | --:--</div>
    </div>
  );
}
