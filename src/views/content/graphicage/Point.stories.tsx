import { Meta, StoryObj } from "storybook-solidjs";
import MapWithPointComponent from "./Point.story";

const meta = {
  component: MapWithPointComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapWithPointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EtablissementPoint: Story = {
  args: {
    radius: 12,
    weight: 4,
    borderColor: "green",
    fillColor: "white",
  },
};

export const RamassagePoint: Story = {
  args: {
    radius: 5,
    weight: 2,
    borderColor: "red",
    fillColor: "white",
  },
};
