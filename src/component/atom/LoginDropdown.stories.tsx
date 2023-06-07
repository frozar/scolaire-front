import { Meta, StoryObj } from "storybook-solidjs";
import LoginDropdown from "./LoginDropdown";

const meta = {
  title: "TopNav/LoginDropdown",
  component: LoginDropdown,
  tags: ["autodocs"],
  args: {
    getProfilePic: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  },
} satisfies Meta<typeof LoginDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginDropDown: Story = {
  args: {
    show: true,
    authenticated: false,
  },
  argTypes: {
    onClick: { action: "Clicked" },
  },
};

// export const LoggedInDropdown: Story = {
//   args: {
//     show: true,
//     authenticated: true,
//   },
// };
