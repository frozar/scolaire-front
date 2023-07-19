import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import MapWithPointComponent from "./Point.storie";

const meta = {
  component: MapWithPointComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapWithPointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MapWithPoint: Story = {};
