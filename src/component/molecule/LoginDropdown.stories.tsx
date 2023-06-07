import { Meta, StoryObj } from "storybook-solidjs";
import LoginDropdownComponent from "./LoginDropdown";

const meta = {
  title: "TopNav/LoginDropdown",
  component: LoginDropdownComponent,
  tags: ["autodocs"],
  args: {
    getProfilePicture: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  },
} satisfies Meta<typeof LoginDropdownComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginDropdown: Story = {
  args: {
    authenticated: () => false,
  },
  argTypes: {
    onClick: { action: "Clicked" },
  },
};

export const LogoutDropdown: Story = {
  args: {
    authenticated: () => true,
  },
  argTypes: {
    onClick: { action: "Clicked" },
  },
};
