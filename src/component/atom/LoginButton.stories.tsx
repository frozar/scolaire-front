import { Meta, StoryObj } from "storybook-solidjs";
import LoginButton from "./LoginButton";

const meta = {
  title: "TopNav/LoginButton",
  component: LoginButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotLoggedButtonIcon: Story = {
  args: {
    getProfilePic: () => false,
  },
};

export const LoggedInButtonIcon: Story = {
  args: {
    getProfilePic: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  },
};
