import { Meta, StoryObj } from "storybook-solidjs";
import { SettingsContentAnimationParameters } from "./SettingsContentAnimationParameters";

const meta = {
  component: SettingsContentAnimationParameters,
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsContentAnimationParameters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsContentAnimationParametersStory: Story = {
};
