import { Meta, StoryObj } from "storybook-solidjs";
import SelectedSchoolItemComponent from "./SelectedSchoolItem";

const meta = {
  component: SelectedSchoolItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectedSchoolItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectedSchoolItemComponent1: Story = {
  args: {
    etablissement: {
      id: 0,
      idPoint: 1,
      lon: 20,
      lat: 20,
      name: "Etablissement test",
      quantity: 20,
    },
  },
};
