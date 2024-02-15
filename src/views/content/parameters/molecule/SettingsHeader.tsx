import PageTitle from "../../../../component/atom/PageTitle";
import { SettingEditActions } from "./SettingEditActions";

import "./SettingsHeader.css";

export function SettingsHeader() {
  return (
    <div class="settings-header">
      <PageTitle title="Paramètres globaux" />
      <SettingEditActions />
    </div>
  );
}
