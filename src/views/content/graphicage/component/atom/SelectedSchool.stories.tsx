import { Meta, StoryObj } from "storybook-solidjs";
import SelectedSchoolComponent from "./SelectedSchool";

const meta = {
  component: SelectedSchoolComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectedSchoolComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsContentAnimationParametersStory: Story = {
  args: {
    schoolSelected: [],
  },
};

export const SettingsContentAnimationParametersStory2: Story = {
  args: {
    schoolSelected: [
      {
        id: 0,
        idPoint: 1,
        lon: 20,
        lat: 20,
        name: "Etablissement test",
        quantity: 20,
      },
    ],
  },
};
