import { Meta, StoryObj } from "storybook-solidjs";
import LoginMenuComponent from "./LoginMenu";

const meta = {
  component: LoginMenuComponent,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked action" },
  },
} satisfies Meta<typeof LoginMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginMenu: Story = {
  args: {
    authenticated: false,
  },
};
