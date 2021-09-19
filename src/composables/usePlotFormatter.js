import { computed } from "vue";
import { format } from "date-fns";

import forecastVars from "@/data/forecastVars.json";

const usePlotFormatter = (varName) => {
  const varUnit = computed(() => {
    const { units } = forecastVars.find((f) => f.name === varName.value);
    return units;
  });

  const valueText = (d, withUnits = false) => {
    if (d === null) return d;

    if (!withUnits)
      return varName.value !== "rain" ? d.toFixed(1) : (d * 100).toFixed(0);

    if (varName.value === "rain") {
      if (d < 0.01) return null;
      return `${(d * 100).toFixed(0)} %`;
    }

    return `${d.toFixed(1)} ${varUnit.value}`;
  };

  const dateText = (d, strFormat = "eee") => format(d, strFormat);

  return { varUnit, valueText, dateText };
};

export default usePlotFormatter;
