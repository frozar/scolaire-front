import L from "leaflet";

import { createSignal } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";
import TimelineReadMode from "./TimelineReadMode";

const meta = {
  component: TimelineReadMode,
  tags: ["autodocs"],
} satisfies Meta<typeof TimelineReadMode>;

export default meta;
type Story = StoryObj<typeof meta>;

const [selected, setSelected] = createSignal(false);
const [color, setColor] = createSignal("00FF00");
const [latLngs, setLatLngs] = createSignal([new L.LatLng(2, 2)]);
const [selected1, setSelected1] = createSignal(false);

const randomPoints = [...Array(10).keys()].map((i) => ({
  id: i,
  leafletId: i,
  name: `point ${i}`,
  lon: 2,
  lat: 2,
  quantity: 10,
  nature: "stop",
}));

export const TimelineAddModeStory: Story = {
  args: {
    line: () => ({
      id: 1,
      schools: [
        {
          id: 1,
          name: "Ecole 1",
          lon: 1,
          lat: 1,
          associated: [],
          nature: "school",
          leafletId: 1,
          selected,
          setSelected,
        },
      ],
      points: randomPoints,
      name: "line 1",
      color,
      setColor,
      latLngs,
      setLatLngs,
      selected1,
      setSelected1,
    }),
  },
};
