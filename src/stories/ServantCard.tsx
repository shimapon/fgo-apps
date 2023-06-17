import Image from "next/image";
import { useState } from "react";
import { HiddenType, QuizTypeConstants } from "../../utils/QuizType";
import { ServantData } from "../../utils/api";
import Passive from "./Passive";
import Skill from "./Skill";

interface Props {
  servant: ServantData;
  hiddenType: HiddenType;
}

const checkShow = (hiddenType: HiddenType, isShow: boolean) => {
  return hiddenType === "ALL" || isShow;
};

const ServantCard: React.FC<Props> = ({ servant, hiddenType }) => {
  const [isShowRare, setIsShowRare] = useState(
    hiddenType === QuizTypeConstants.PART_C
  );
  const [isShowClass, setIsShowClass] = useState(
    hiddenType === QuizTypeConstants.PART_B
  );
  const [isShowNoble, setIsShowNoble] = useState(false);
  const [isShowNobleD, setIsShowNobleD] = useState(
    hiddenType === QuizTypeConstants.PART_C
  );
  const [isShowNobleRank, setIsShowNobleRank] = useState(
    hiddenType === QuizTypeConstants.PART_C
  );
  const [isShowNobleCard, setIsShowNobleCard] = useState(
    hiddenType === QuizTypeConstants.PART_B
  );
  const [isShowNobleRuby, setIsShowNobleRuby] = useState(false);
  const [isShowNobleType, setIsShowNobleType] = useState(
    hiddenType === QuizTypeConstants.PART_A
  );
  const [isShowNobleDetail, setIsShowNobleDetail] = useState(false);
  const [isShowSex, setIsShowSex] = useState(
    hiddenType === QuizTypeConstants.PART_A
  );
  const [isShowAttr, setIsShowAttr] = useState(
    hiddenType === QuizTypeConstants.PART_B ||
      hiddenType === QuizTypeConstants.PART_C
  );
  const [isShow, setIsShow] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <div
      className="p-4 mt-2 rounded bg-gray-800 font-shippori w-11/12 snap-center"
      style={{ minWidth: "310px" }}
    >
      <div className="grid grid-cols-[auto_120px] gap-3">
        <div className="grid grid-rows-[1fr_auto]">
          <h2
            className={
              "font-bold" + (servant.name.length < 7 ? "text-xl" : "text-base")
            }
          >
            {checkShow(hiddenType, isShow) ? servant.name : "？？？"}
          </h2>

          <div className="gap-1 grid justify-stretch">
            {/* {checkShow(hiddenType, isShowRare) && <p>レア：{servant.rarity}</p>} */}

            <p
              className={
                "text-center" +
                (checkShow(hiddenType, isShowClass || isShow)
                  ? ""
                  : " text-gray-600")
              }
              onClick={() => setIsShowClass(true)}
            >
              {checkShow(hiddenType, isShowClass || isShow)
                ? servant.className
                : "クラス"}
            </p>

            <p
              className={
                "text-center border-t-2 border-gray-700" +
                (checkShow(hiddenType, isShowSex || isShow)
                  ? ""
                  : " text-gray-600")
              }
              onClick={() => setIsShowSex(true)}
            >
              {checkShow(hiddenType, isShowSex || isShow)
                ? servant.gender
                : "性別"}
            </p>

            <p
              className={
                "text-center border-t-2 border-gray-700" +
                (checkShow(hiddenType, isShowAttr || isShow)
                  ? ""
                  : " text-gray-600")
              }
              onClick={() => setIsShowAttr(true)}
            >
              {checkShow(hiddenType, isShowAttr || isShow)
                ? servant.attribute
                : "天地人"}
            </p>
          </div>
        </div>

        <div className="justify-self-end">
          {servant.faces.map((face, i) => {
            return (
              <button
                key={i}
                onClick={() => setPopupVisible(true)}
                disabled={checkShow(hiddenType, isShow)}
              >
                <Image
                  src={
                    checkShow(hiddenType, isShow)
                      ? face
                      : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
                  }
                  width={120}
                  height={120}
                  alt=""
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-2 mt-4 overflow-x-auto">
        {servant.skills.map((skill, i) => {
          return (
            <Skill
              key={i}
              hiddenType={hiddenType}
              isShow={isShow}
              skill={skill}
              icon={
                i === servant.isShowSkill &&
                hiddenType === QuizTypeConstants.PART_A
              }
              name={
                i === servant.isShowSkill &&
                hiddenType === QuizTypeConstants.PART_B
              }
            />
          );
        })}
      </div>
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {servant.classPassives.map((skill, i) => {
          return (
            <Passive
              hiddenType={hiddenType}
              isShow={isShow}
              skill={skill}
              key={i}
              icon={hiddenType === QuizTypeConstants.PART_A}
            />
          );
        })}
      </div>
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {servant.noblePhantasms.map((noblePhantasm, i) => {
          return (
            <div key={i} className="p-2 bg-gray-700 min-w-full">
              <div>
                <p
                  className={
                    "text-xs" +
                    (checkShow(hiddenType, isShowNobleRuby || isShow)
                      ? ""
                      : " text-gray-600")
                  }
                >
                  {checkShow(hiddenType, isShowNobleRuby || isShow)
                    ? noblePhantasm.ruby
                    : noblePhantasm.hiddenRuby}
                </p>

                <p
                  className={
                    "text-lg" +
                    (checkShow(hiddenType, isShowNoble || isShow)
                      ? ""
                      : checkShow(hiddenType, !isShowNoble && isShowNobleD)
                      ? ""
                      : " text-gray-600")
                  }
                >
                  {checkShow(hiddenType, isShowNoble || isShow)
                    ? noblePhantasm.name
                    : checkShow(hiddenType, !isShowNoble && isShowNobleD)
                    ? noblePhantasm.dummyName
                    : noblePhantasm.hiddenName}
                </p>
              </div>
              <p
                className={
                  "text-sm my-2" +
                  (checkShow(hiddenType, isShowNobleDetail || isShow)
                    ? ""
                    : " text-gray-600")
                }
                onClick={() => {
                  setIsShowNobleDetail(true);
                }}
              >
                {checkShow(hiddenType, isShowNobleDetail || isShow)
                  ? noblePhantasm.detail
                  : "宝具詳細"}
              </p>

              <p
                className={
                  "text-sm text-end " +
                  (checkShow(hiddenType, isShowNobleRank || isShow)
                    ? ""
                    : " text-gray-600")
                }
                onClick={() => setIsShowNobleRank(true)}
              >
                ランク：
                {checkShow(hiddenType, isShowNobleRank || isShow)
                  ? noblePhantasm.rank
                  : "■"}
              </p>
              <p
                className={
                  "text-sm text-end " +
                  (checkShow(hiddenType, isShowNobleType || isShow)
                    ? ""
                    : " text-gray-600")
                }
                onClick={() => setIsShowNobleType(true)}
              >
                {checkShow(hiddenType, isShowNobleType || isShow)
                  ? noblePhantasm.type
                  : "宝具種別"}
              </p>
              <p
                className={
                  "text-sm text-end " +
                  (checkShow(hiddenType, isShowNobleCard || isShow)
                    ? ""
                    : " text-gray-600")
                }
                onClick={() => setIsShowNobleCard(true)}
              >
                {checkShow(hiddenType, isShowNobleCard || isShow)
                  ? noblePhantasm.card
                  : "色"}
              </p>
            </div>
          );
        })}
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75 text-center">
          <div className="bg-gray-800 py-8 px-12 rounded text-white">
            <p>正解を出しますか？</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-6 rounded mt-4"
              onClick={() => {
                setIsShow(true);
                setPopupVisible(false);
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-500 py-2 px-6 rounded mt-4 ml-8"
              onClick={() => setPopupVisible(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServantCard;
