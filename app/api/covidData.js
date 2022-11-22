import { getCovidData } from "../utils/hooks";

export default function handler(req, res) {
  const data = getCovidData();

  res.status(200).json(data);
}
