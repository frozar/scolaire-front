import { Meta, StoryObj } from "storybook-solidjs";
import MapWithPointComponent from "./Point.mapWrapper.story";

const meta = {
  component: MapWithPointComponent,
} satisfies Meta<typeof MapWithPointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// TODO: Setup reactivity on blinking point and size
export const EtablissementPoint: Story = {
  args: {
    radius: 12,
    weight: 4,
    borderColor: "green",
    fillColor: "white",
    isBlinking: true,
  },
};

export const RamassagePoint: Story = {
  args: {
    radius: 5,
    weight: 2,
    borderColor: "red",
    fillColor: "white",
    isBlinking: true,
  },
};
