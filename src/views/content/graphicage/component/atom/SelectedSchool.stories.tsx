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
