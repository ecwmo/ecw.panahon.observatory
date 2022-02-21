export interface ForecastVar {
  name: string;
  name2: string;
  units: string;
  title: string;
  stroke: string;
  fill: string;
  dotColor: string;
}

declare module "forecastVars.json" {
  const ForecastVars: ForecastVar[];
  export default ForecastVars;
}
