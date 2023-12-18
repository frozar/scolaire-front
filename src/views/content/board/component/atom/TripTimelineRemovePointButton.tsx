import { FaRegularTrashCan } from "solid-icons/fa";

import "./TripTimelineRemovePointButton.css";

export function TripTimelineRemovePointButton(props: { onClick: () => void }) {
  return (
    <button
      class="button-delete button-delete-timeline"
      onClick={() => props.onClick()}
    >
      <FaRegularTrashCan />
    </button>
  );
}
