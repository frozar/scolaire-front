import { Meta, StoryObj } from "storybook-solidjs";
import mapLeaflet from "./mapLeaflet";

const meta = {
  component: mapLeaflet,
  tags: ["autodocs"],
} satisfies Meta<typeof mapLeaflet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mymap: Story = {
  args: {
    lat: -20.9466588303741,
    lon: 55.5343806753509,
    zoom: 15,
  },
};

export const Mymap2: Story = {
  args: {
    lat: -20.94,
    lon: 55.53,
    zoom: 15,
  },
};
