import { Meta, StoryObj } from "storybook-solidjs";
import LoginDropdownComponent from "./LoginDropdown";
import { createSignal } from "solid-js";
import { AvatarLoggedIn } from "../atom/LoginAvatar.stories";

const meta = {
  title: "TopNav/LoginDropdown",
  component: LoginDropdownComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginDropdownComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeAuth, setFakeAuth] = createSignal(false);

function FakeLogin() {
  setFakeAuth((bool) => !bool);
}

export const LoginDropdown: Story = {
  args: {
    authenticated: fakeAuth,
    handleLogin: FakeLogin,
    getProfilePicture: () => AvatarLoggedIn.args.profilePicture(),
  },
};
