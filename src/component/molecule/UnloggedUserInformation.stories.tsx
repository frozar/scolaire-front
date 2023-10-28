import { Meta, StoryObj } from "storybook-solidjs";

import UnloggedUserInformationComponent from "./UnloggedUserInformation";

const meta = {
  component: UnloggedUserInformationComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UnloggedUserInformationComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnloggedUserInformation: Story = {
  args: {
    incMessage: 0,
  },
};
