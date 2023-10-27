import { Meta, StoryObj } from "storybook-solidjs";
import LoginAvatarComponent from "./LoginAvatar";

const meta = {
  component: LoginAvatarComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginAvatarComponent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LoginAvatar: Story = {
  args: {
    authenticated: false,
    drawAttention: true,
  },
  argTypes: {
    profilePicture: {
      control: "select",
      options: [
        "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
        "https://via.placeholder.com/600/92c952",
      ],
    },
  },
};
