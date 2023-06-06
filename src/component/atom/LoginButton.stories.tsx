import { Meta, StoryObj } from "storybook-solidjs";
import LoginButton from "./LoginButton";

const meta = {
  title: "TopNav/Login",
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
      "https://s.gravatar.com/avatar/89c51c7ed1dbc64a360ba375b76c6665?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Flu.png",
  },
};
