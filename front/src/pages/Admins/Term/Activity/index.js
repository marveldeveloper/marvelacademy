import React, { useContext } from "react";
import { useParams } from "react-router";
import Video from "./Video";
import Exam from "./Exam";
import Homework from "./Homework";
import { Context } from "..";
export default function Activity() {
  const { sectionIndex, activityIndex } = useParams();
  const { sections } = useContext(Context);
  const activity = sections[sectionIndex][activityIndex];
  const types = [
    {
      component: Video,
      name: "video",
    },
    {
      component: Exam,
      name: "exam",
    },
    {
      component: Homework,
      name: "homework",
    },
  ];
  const activeType = activity && types.find((e) => e.name === activity.type);
  return (
    <div className="Activity">
      {activity && React.createElement(activeType.component)}
    </div>
  );
}
