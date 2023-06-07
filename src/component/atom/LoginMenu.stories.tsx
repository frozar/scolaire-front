import { Meta, StoryObj } from "storybook-solidjs";
import LoginMenu from "./LoginMenu";

const meta = {
  title: "TopNav/LoginMenu",
  component: LoginMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginMenu_: Story = {
  args: {
    authenticated: false,
    show: true,
  },
};
