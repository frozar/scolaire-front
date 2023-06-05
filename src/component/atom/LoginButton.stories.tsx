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
      "https://www.pngitem.com/pimgs/m/537-5371524_cool-panda-profile-hd-png-download.png",
  },
};
