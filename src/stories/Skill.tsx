import Image from "next/image";
import { useState } from "react";
import { HiddenType } from "../../utils/QuizType";

interface Props {
  hiddenType: HiddenType;
  isShow: boolean;
  skill: {
    name: string;
    detail: string;
    icon: string;
  };
  icon: boolean;
  name: boolean;
}

const Skill: React.FC<Props> = ({ hiddenType, isShow, skill, icon, name }) => {
  const [isShowIcon, setIsShowIcon] = useState(hiddenType === "ALL" || icon);
  const [isShowName, setIsShowName] = useState(hiddenType === "ALL" || name);
  const [isShowDetail, setIsShowDetail] = useState(hiddenType === "ALL");

  return (
    <div className="p-2 bg-gray-700">
      <button
        className={isShow || isShowName ? "" : "text-gray-600"}
        onClick={() => setIsShowName(true)}
        disabled={isShow || isShowName}
      >
        {isShow || isShowName ? skill.name : "スキル名"}
      </button>
      <div className="grid grid-cols-[60px_auto] gap-2 mt-2">
        <button
          onClick={() => setIsShowIcon(true)}
          disabled={isShow || isShowIcon}
        >
          <Image
            src={
              isShow || isShowIcon
                ? skill.icon
                : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
            }
            width={60}
            height={60}
            alt=""
          />
        </button>
        <button
          className={
            "text-sm" + (isShow || isShowDetail ? "" : " text-gray-600")
          }
          onClick={() => setIsShowDetail(true)}
          disabled={isShow || isShowDetail}
        >
          {isShow || isShowDetail ? skill.detail : "スキル詳細を表示"}
        </button>
      </div>
    </div>
  );
};

export default Skill;
