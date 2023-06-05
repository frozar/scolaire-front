import { Meta, StoryObj } from "storybook-solidjs";
import LoginAvatar from "./LoginAvatar";

const meta = {
  title: "TopNav/Avatar",
  component: LoginAvatar,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginAvatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarLoggedOut: Story = {
  args: {
    authenticated: () => false,
    profilePicture: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  },
};

export const AvatarLoggedIn: Story = {
  args: {
    authenticated: () => true,
    profilePicture: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  },
};
