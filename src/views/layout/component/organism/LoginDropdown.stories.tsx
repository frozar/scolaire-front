import { Meta, StoryObj } from "storybook-solidjs";
import LoginDropdownComponent from "./LoginDropdown";
import { createSignal } from "solid-js";

const meta = {
  component: LoginDropdownComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginDropdownComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeAuthenticated, setFakeAuthenticated] = createSignal(false);

function toggleFakeAuthenticated() {
  setFakeAuthenticated((bool) => !bool);
}

export const LoginDropdown: Story = {
  args: {
    authenticated: fakeAuthenticated,
    handleLogin: toggleFakeAuthenticated,
    getProfilePicture: () =>
      "https://raw.githubusercontent.com/frozar/scolaire-front/main/public/profile-picture.jpeg",
  },
};
