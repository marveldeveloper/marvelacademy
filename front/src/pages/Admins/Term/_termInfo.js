import { showTime } from "../../../methods";
import { termStatus } from "../../../constants";
export default function termInfo(state = {}) {
  return [
    {
      label: "موضوع ترم:",
      value: state.title,
    },
    {
      label: "نام مدرس:",
      value: state.teacherName,
    },
    {
      label: "شماره ترم:",
      value: state.index + 1,
    },
    {
      label: "تعداد ویدیوها:",
      value: state.totalVideos,
    },
    {
      label: "تعداد آزمون‌ها:",
      value: state.totalExams,
    },
    {
      label: "مدت زمان ترم:",
      value: showTime(state.time),
    },
    {
      label: "وضعیت ترم:",
      value: termStatus.badge(state.status),
    },
    {
      label: "توضیحات:",
      value: state.description,
    },
  ];
}
