import { Meta, StoryObj } from "storybook-solidjs";
import PelletComponent from "./Pellet";

const meta = {
  component: PelletComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PelletComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pellet: Story = {};
