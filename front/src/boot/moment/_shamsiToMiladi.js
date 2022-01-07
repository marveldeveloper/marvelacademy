import moment from "moment-jalaali";
export default function shamsiToMiladi({
  date = new Date(),
  formatEn = "YYYY/MM/DD",
  formatFa = "jYYYY/jMM/jDD",
}) {
  return moment(date, formatFa).format(formatEn);
}
