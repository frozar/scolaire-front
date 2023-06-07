import { Meta, StoryObj } from "storybook-solidjs";
import LoginDropdown from "./LoginDropdown";

const meta = {
  title: "TopNav/LoginDropdown",
  component: LoginDropdown,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotLoggedDropdown: Story = {
  args: {
    getProfilePic: () => false,
    show: () => true,
    authenticated: () => false,
  },
  argTypes: {
    onClick: { action: "Clicked" },
  },
};

export const LoggedInDropdown: Story = {
  args: {
    getProfilePic: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
    show: () => true,
    authenticated: () => true,
  },
};
