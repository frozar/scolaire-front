import { Meta, StoryObj } from "storybook-solidjs";

import UnloggedUserLogoComponent from "./UnloggedUserLogo";

const meta = {
  component: UnloggedUserLogoComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UnloggedUserLogoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnloggedUserLogo: Story = {
  args: {
    drawAttention: true,
  },
};
