import { Meta, StoryObj } from "storybook-solidjs";
import LoginModal from "./LoginModal";
import "../../../.storybook/StorybookPreviewHack.css";

const meta = {
  title: "TopNav/LoginModal",
  component: LoginModal,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotLoggedModal: Story = {
  args: {
    authenticated: () => false,
    show: () => true,
  },
};

export const LoggedInButtonIcon: Story = {
  args: {
    authenticated: () => true,
    show: () => true,
  },
};
