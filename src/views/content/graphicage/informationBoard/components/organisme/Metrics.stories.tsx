import { Meta, StoryObj } from "storybook-solidjs";
import { BusLineType } from "../../../../../../_entities/bus-line.entity";
import Metrics, { MetricsProps } from "./Metrics";

const meta = {
  component: Metrics,
  tags: ["autodocs"],
} satisfies Meta<typeof Metrics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: MetricsProps) => {
    return <Metrics {...props} />;
  },

  args: {
    line: {
      metrics: () => {
        distanceBus: 0;
      },
    } as Pick<BusLineType, "metrics">,
  },
};
