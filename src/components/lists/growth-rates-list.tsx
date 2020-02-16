import { ListSettings } from "@/components/lists/list";
import { IDDisplay } from "@/components/displays/id-display";
import { GrowthRates } from "@/model/constants";
import { stylesheet } from "typestyle";

interface GrowthRateForList {
  expTo100: number;
}

export const GrowthRatesList: ListSettings<GrowthRateForList> = {
  model: () =>
    Object.fromEntries(
      Object.entries(GrowthRates).map(([rate, obj]) => [
        rate,
        {
          expTo100: obj.atLevel(100)
        }
      ])
    ),
  layout: [
    {
      text: "ID",
      sort: ([id1], [id2]) => id1.localeCompare(id2),
      render: (h, [id, item]) => <IDDisplay value={id} />
    },
    {
      text: "At level 100",
      sort: ([, r1], [, r2]) => r1.expTo100 - r2.expTo100,
      render: (h, [, r]) => (
        <div class={styles.exp}>
          <span class={styles.expValue}>{r.expTo100.toLocaleString()}</span>
        </div>
      )
    }
  ],
  filter: ([id], input) => id.toUpperCase().includes(input.toUpperCase())
};

const styles = stylesheet({
  expValue: {
    fontFamily: "Consolas"
  },
  exp: {
    textAlign: "right"
  }
});
