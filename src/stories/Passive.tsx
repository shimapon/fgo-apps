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
}

const Passive: React.FC<Props> = ({ hiddenType, isShow, skill, icon }) => {
  const [isShowIcon, setIsShowIcon] = useState(hiddenType === "ALL" || icon);
  const [isShowName, setIsShowName] = useState(hiddenType === "ALL" || isShow);
  const [isShowDetail, setIsShowDetail] = useState(hiddenType === "ALL");

  return (
    <div className="p-2 bg-gray-700" style={{ minWidth: "150px" }}>
      <button
        className={"text-sm" + (isShow || isShowName ? "" : " text-gray-600")}
        onClick={() => setIsShowName(true)}
        disabled={isShow || isShowName}
      >
        {isShow || isShowName ? skill.name : "スキル名"}
      </button>

      <div className="grid grid-cols-[40px_auto] gap-2 mt-1">
        {
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
              width={40}
              height={40}
              alt=""
            />
          </button>
        }
        <button
          className={
            "text-xs" + (isShow || isShowDetail ? "" : " text-gray-600")
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

export default Passive;
