import { useState } from "react";
import { ServantData } from "../../utils/api";
import Image from "next/image";

type HiddenType = "ALL" | "PART_A" | "PART_B";

interface Props {
  servant: ServantData;
  hiddenType: HiddenType;
}

const checkShow = (hiddenType: HiddenType, isShow: boolean) => {
  return hiddenType === "ALL" || isShow;
};

const ServantCard: React.FC<Props> = ({ servant, hiddenType }) => {
  const [isShowRare, setIsShowRare] = useState(false);
  const [isShowClass, setIsShowClass] = useState(false);
  const [isShowNoble, setIsShowNoble] = useState(false);
  const [isShowNobleD, setIsShowNobleD] = useState(true);
  const [isShowNobleRank, setIsShowNobleRank] = useState(false);
  const [isShowNobleCard, setIsShowNobleCard] = useState(false);
  const [isShowNobleRuby, setIsShowNobleRuby] = useState(false);
  const [isShowNobleType, setIsShowNobleType] = useState(true);
  const [isShowNobleDetail, setIsShowNobleDetail] = useState(false);
  const [isShowSex, setIsShowSex] = useState(false);
  const [isShowSkillIcon, setIsShowSkillIcon] = useState(false);
  const [isShowSkillIconD, setIsShowSkillIconD] = useState(true);
  const [isShowSkillDetail, setIsShowSkillDetail] = useState(false);
  const [isShowSkillName, setIsShowSkillName] = useState(false);
  const [isShowSkillNameD, setIsShowSkillNameD] = useState(false);
  const [isShowAttr, setIsShowAttr] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isShowPassiveName, setIsShowPassiveName] = useState(false);
  const [isShowPassiveDetail, setIsShowPassiveDetail] = useState(false);
  const [isShowPassiveIcon, setIsShowPassiveIcon] = useState(true);
  // TODO、宝具の文字列を押すとランダムに戻す。
  const stateFunctions = [
    setIsShowRare,
    setIsShowClass,
    setIsShowNoble,
    setIsShowNobleRank,
    setIsShowNobleCard,
    setIsShowNobleRuby,
    setIsShowNobleType,
    setIsShowNobleDetail,
    setIsShowSex,
    setIsShowSkillIcon,
    setIsShowSkillDetail,
    setIsShowSkillName,
    setIsShowSkillNameD,
    setIsShowAttr,
    setIsShowPassiveName,
    setIsShowPassiveDetail,
  ];

  const [randomIndex, setRandomIndex] = useState(null);

  const clickRandomSet = () => {
    const randomIndex = Math.floor(Math.random() * stateFunctions.length);
    stateFunctions[randomIndex](true);
  };

  return (
    <div className="p-6 mt-2 rounded bg-gray-800 font-shippori w-full min-w-full">
      <div className="grid grid-cols-[auto_120px] gap-3">
        <div className="grid grid-rows-[1fr_auto]">
          <h2 className="font-bold text-xl">
            {checkShow(hiddenType, isShow) ? servant.name : "サーヴァント名"}
          </h2>

          <div className="gap-1 grid justify-stretch">
            {/* {checkShow(hiddenType, isShowRare) && <p>レア：{servant.rarity}</p>} */}

            <p className="text-center text-gray-300">
              {checkShow(hiddenType, isShowClass)
                ? servant.className
                : "クラス"}
            </p>

            <p className="text-center text-gray-300 border-t-2 border-gray-600">
              {checkShow(hiddenType, isShowSex) ? servant.gender : "性別"}
            </p>

            <p className="text-center text-gray-300 border-t-2 border-gray-600">
              {checkShow(hiddenType, isShowAttr) ? servant.attribute : "天地人"}
            </p>
          </div>
        </div>

        <div className="justify-self-end">
          {servant.faces.map((face, i) => {
            return (
              <Image
                src={
                  checkShow(hiddenType, isShow)
                    ? face
                    : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
                }
                key={i}
                width={120}
                height={120}
                alt=""
              />
            );
          })}
        </div>
      </div>
      <div className="grid gap-2 mt-4 overflow-x-auto">
        {servant.skills.map((skill, i) => {
          return (
            <div key={i} className="p-2 bg-gray-700">
              <p>
                {checkShow(
                  hiddenType,
                  isShowSkillName ||
                    (isShowSkillNameD && i === servant.isShowSkillName)
                )
                  ? skill.name
                  : "スキル名"}
              </p>
              <div className="grid grid-cols-[60px_auto] gap-2 mt-2">
                <Image
                  src={
                    checkShow(
                      hiddenType,
                      isShowSkillIcon ||
                        (isShowSkillIconD && i === servant.isShowSkill)
                    )
                      ? skill.icon
                      : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
                  }
                  key={i}
                  width={60}
                  height={60}
                  alt=""
                />
                <p className="text-sm">
                  {checkShow(hiddenType, isShowSkillDetail)
                    ? skill.detail
                    : "スキル詳細"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {servant.classPassives.map((classPassive, i) => {
          return (
            <div
              key={i}
              className="p-2 bg-gray-700"
              style={{ minWidth: "150px" }}
            >
              <p className="text-sm">
                {checkShow(hiddenType, isShowPassiveName)
                  ? classPassive.name
                  : "スキル名"}
              </p>

              <div className="grid grid-cols-[40px_auto] gap-2 mt-1">
                {
                  <Image
                    src={
                      checkShow(hiddenType, isShowPassiveIcon)
                        ? classPassive.icon
                        : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
                    }
                    key={i}
                    width={40}
                    height={40}
                    alt=""
                  />
                }
                <p className="text-xs">
                  {checkShow(hiddenType, isShowPassiveDetail)
                    ? classPassive.detail
                    : "スキル詳細"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {servant.noblePhantasms.map((noblePhantasm, i) => {
          return (
            <div key={i} className="p-2 bg-gray-700 min-w-full">
              <div>
                <p className=" text-xs">
                  {checkShow(hiddenType, isShowNobleRuby)
                    ? noblePhantasm.ruby
                    : "ルビ"}
                </p>

                <p className="text-lg">
                  {checkShow(hiddenType, isShowNoble)
                    ? noblePhantasm.name
                    : "宝具名"}
                </p>
                {!checkShow(hiddenType, !isShowNoble && isShowNobleD) && (
                  <p className="text-lg">{noblePhantasm.dummyName}</p>
                )}
              </div>
              <p className="text-sm my-2">
                {checkShow(hiddenType, isShowNobleDetail)
                  ? noblePhantasm.detail
                  : "宝具詳細"}
              </p>

              <p className=" text-sm text-end">
                ランク：
                {checkShow(hiddenType, isShowNobleRank)
                  ? noblePhantasm.rank
                  : "■"}
              </p>
              <p className=" text-sm text-end">
                {checkShow(hiddenType, isShowNobleType)
                  ? noblePhantasm.type
                  : "宝具種別"}
              </p>
              <p className=" text-sm text-end">
                {checkShow(hiddenType, isShowNobleCard)
                  ? noblePhantasm.card
                  : "色"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServantCard;
