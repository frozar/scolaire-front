import { Meta, StoryObj } from "storybook-solidjs";

import SearchLogoComponent from "./SearchLogo";

const meta = {
  component: SearchLogoComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchLogoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchLogo: Story = {};
