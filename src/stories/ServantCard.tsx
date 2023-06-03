import { useState } from "react";
import { ServantData } from "../../utils/api";
import Image from "next/image";

type HiddenType = "PART_A" | "PART_B" | "PART_C" | "ALL";

interface Props {
  servant: ServantData;
  hiddenType: HiddenType;
}

const checkShow = (hiddenType: HiddenType, isShow: boolean) => {
  return hiddenType === "ALL" || isShow;
};

const ServantCard: React.FC<Props> = ({ servant, hiddenType }) => {
  const [isShowRare, setIsShowRare] = useState(hiddenType === "PART_C");
  const [isShowClass, setIsShowClass] = useState(hiddenType === "PART_B");
  const [isShowNoble, setIsShowNoble] = useState(false);
  const [isShowNobleD, setIsShowNobleD] = useState(hiddenType === "PART_C");
  const [isShowNobleRank, setIsShowNobleRank] = useState(
    hiddenType === "PART_C"
  );
  const [isShowNobleCard, setIsShowNobleCard] = useState(false);
  const [isShowNobleRuby, setIsShowNobleRuby] = useState(false);
  const [isShowNobleType, setIsShowNobleType] = useState(
    hiddenType === "PART_A"
  );
  const [isShowNobleDetail, setIsShowNobleDetail] = useState(false);
  const [isShowSex, setIsShowSex] = useState(hiddenType === "PART_A");
  const [isShowSkillIcon, setIsShowSkillIcon] = useState(false);
  const [isShowSkillIconD, setIsShowSkillIconD] = useState(
    hiddenType === "PART_A"
  );
  const [isShowSkillDetail, setIsShowSkillDetail] = useState(false);
  const [isShowSkillName, setIsShowSkillName] = useState(false);
  const [isShowSkillNameD, setIsShowSkillNameD] = useState(
    hiddenType === "PART_B"
  );
  const [isShowAttr, setIsShowAttr] = useState(
    hiddenType === "PART_B" || hiddenType === "PART_C"
  );
  const [isShow, setIsShow] = useState(false);
  const [isShowPassiveName, setIsShowPassiveName] = useState(false);
  const [isShowPassiveDetail, setIsShowPassiveDetail] = useState(
    hiddenType === "PART_C"
  );
  const [isShowPassiveIcon, setIsShowPassiveIcon] = useState(
    hiddenType === "PART_A"
  );

  return (
    <div
      className="p-6 mt-2 rounded bg-gray-800 font-shippori w-11/12 snap-center"
      style={{ minWidth: "310px" }}
    >
      <div className="grid grid-cols-[auto_120px] gap-3">
        <div className="grid grid-rows-[1fr_auto]">
          <h2
            className={
              "font-bold" + (servant.name.length < 7 ? "text-xl" : "text-base")
            }
          >
            {checkShow(hiddenType, isShow) ? servant.name : "サーヴァント名"}
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
                onClick={() => setIsShow(true)}
              />
            );
          })}
        </div>
      </div>
      <div className="grid gap-2 mt-4 overflow-x-auto">
        {servant.skills.map((skill, i) => {
          return (
            <div key={i} className="p-2 bg-gray-700">
              <p
                className={
                  checkShow(
                    hiddenType,
                    isShowSkillName ||
                      (isShowSkillNameD && i === servant.isShowSkillName) ||
                      isShow
                  )
                    ? ""
                    : "text-gray-600"
                }
                onClick={() => setIsShowSkillName(true)}
              >
                {checkShow(
                  hiddenType,
                  isShowSkillName ||
                    (isShowSkillNameD && i === servant.isShowSkillName) ||
                    isShow
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
                        (isShowSkillIconD && i === servant.isShowSkill) ||
                        isShow
                    )
                      ? skill.icon
                      : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
                  }
                  key={i}
                  width={60}
                  height={60}
                  alt=""
                  onClick={() => setIsShowSkillIcon(true)}
                />
                <p
                  className={
                    "text-sm" +
                    (checkShow(hiddenType, isShowSkillDetail || isShow)
                      ? ""
                      : " text-gray-600")
                  }
                  onClick={() => setIsShowSkillDetail(true)}
                >
                  {checkShow(hiddenType, isShowSkillDetail || isShow)
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
              <p
                className={
                  "text-sm" +
                  (checkShow(hiddenType, isShowPassiveName || isShow)
                    ? ""
                    : " text-gray-600")
                }
                onClick={() => setIsShowPassiveName(true)}
              >
                {checkShow(hiddenType, isShowPassiveName || isShow)
                  ? classPassive.name
                  : "スキル名"}
              </p>

              <div className="grid grid-cols-[40px_auto] gap-2 mt-1">
                {
                  <Image
                    src={
                      checkShow(hiddenType, isShowPassiveIcon || isShow)
                        ? classPassive.icon
                        : "https://static.atlasacademy.io/JP/SkillIcons/skill_999999.png"
                    }
                    key={i}
                    width={40}
                    height={40}
                    alt=""
                    onClick={() => setIsShowPassiveIcon(true)}
                  />
                }
                <p
                  className={
                    "text-xs" +
                    (checkShow(hiddenType, isShowPassiveDetail || isShow)
                      ? ""
                      : " text-gray-600")
                  }
                  onClick={() => setIsShowPassiveDetail(true)}
                >
                  {checkShow(hiddenType, isShowPassiveDetail || isShow)
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
    </div>
  );
};

export default ServantCard;
