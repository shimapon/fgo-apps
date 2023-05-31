import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import { fetchServantData, ServantData } from "../../utils/api";
import { useState } from "react";

const handleReload = () => {
  window.location.reload(); // ページのリロード
};

const Index = ({ servantData }: Props) => {
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
    <div className="p-4 text-gray-100">
      <div>
        <button
          className="m-2 w-full p-3 bg-slate-600 rounded"
          onClick={clickRandomSet}
        >
          ランダムに公開
        </button>
        {randomIndex !== null && (
          <p>設定された項目: {stateFunctions[randomIndex].name}</p>
        )}
      </div>
      <div className="grid grid-cols-3">
        <div>
          <input
            type="checkbox"
            checked={isShowRare}
            onChange={() => setIsShowRare(!isShowRare)}
          />
          <label>レア</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowClass}
            onChange={() => setIsShowClass(!isShowClass)}
          />
          <label>クラス</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNobleD}
            onChange={() => setIsShowNobleD(!isShowNobleD)}
          />
          <label>宝具名ダミー</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNoble}
            onChange={() => setIsShowNoble(!isShowNoble)}
          />
          <label>宝具名</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNobleRank}
            onChange={() => setIsShowNobleRank(!isShowNobleRank)}
          />
          <label>宝具ランク</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNobleCard}
            onChange={() => setIsShowNobleCard(!isShowNobleCard)}
          />
          <label>宝具色</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNobleType}
            onChange={() => setIsShowNobleType(!isShowNobleType)}
          />
          <label>宝具種別</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNobleRuby}
            onChange={() => setIsShowNobleRuby(!isShowNobleRuby)}
          />
          <label>ルビ</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowNobleDetail}
            onChange={() => setIsShowNobleDetail(!isShowNobleDetail)}
          />
          <label>宝具詳細</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowSex}
            onChange={() => setIsShowSex(!isShowSex)}
          />
          <label>性別</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowSkillIcon}
            onChange={() => setIsShowSkillIcon(!isShowSkillIcon)}
          />
          <label>スキルアイコン</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowSkillIconD}
            onChange={() => setIsShowSkillIconD(!isShowSkillIconD)}
          />
          <label>スキルアイコン1枚</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowSkillName}
            onChange={() => setIsShowSkillName(!isShowSkillName)}
          />
          <label>スキル名</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowSkillNameD}
            onChange={() => setIsShowSkillNameD(!isShowSkillNameD)}
          />
          <label>スキル名1個</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowSkillDetail}
            onChange={() => setIsShowSkillDetail(!isShowSkillDetail)}
          />
          <label>スキル詳細</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowAttr}
            onChange={() => setIsShowAttr(!isShowAttr)}
          />
          <label>天地人</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowPassiveName}
            onChange={() => setIsShowPassiveName(!isShowPassiveName)}
          />
          <label>パッシブスキル名</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowPassiveDetail}
            onChange={() => setIsShowPassiveDetail(!isShowPassiveDetail)}
          />
          <label>パッシブスキル詳細</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShowPassiveIcon}
            onChange={() => setIsShowPassiveIcon(!isShowPassiveIcon)}
          />
          <label>パッシブスキルアイコン</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={isShow}
            onChange={() => setIsShow(!isShow)}
          />
          <label>正解出す！</label>
        </div>
      </div>
      <h1 className="font-bold">サーヴァント５騎ランダム</h1>
      {servantData.map((servant, index) => {
        return (
          <div key={index} className="py-12 px-6 mt-2 rounded bg-gray-700">
            {isShow && <h2 className="font-bold text-lg">{servant.name}</h2>}{" "}
            {isShowRare && <p>レア：{servant.rarity}</p>}
            {isShowClass && <p>クラス：{servant.className}</p>}
            {isShowSex && <p>性別：{servant.gender}</p>}
            {isShowAttr && <p>天地人：{servant.attribute}</p>}
            {isShow && (
              <div className="flex gap-2 mt-2">
                {servant.faces.map((face, i) => {
                  return (
                    <Image src={face} key={i} width={120} height={120} alt="" />
                  );
                })}
              </div>
            )}
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {servant.skills.map((skill, i) => {
                return (
                  <div
                    key={i}
                    style={{ minWidth: "28%" }}
                    className="p-2 bg-slate-800 rounded"
                  >
                    {(isShowSkillName ||
                      (isShowSkillNameD && i === servant.isShowSkillName)) && (
                      <p>{skill.name}</p>
                    )}
                    {isShowSkillDetail && (
                      <p className="text-sm">{skill.detail}</p>
                    )}
                    {(isShowSkillIcon ||
                      (isShowSkillIconD && i === servant.isShowSkill)) && (
                      <Image
                        src={skill.icon}
                        key={i}
                        width={60}
                        height={60}
                        alt=""
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {servant.classPassives.map((classPassive, i) => {
                return (
                  <div
                    key={i}
                    style={{ minWidth: "28%" }}
                    className="p-2 bg-slate-400 rounded"
                  >
                    {isShowPassiveName && <p>{classPassive.name}</p>}
                    {isShowPassiveDetail && (
                      <p className="text-sm">{classPassive.detail}</p>
                    )}
                    {isShowPassiveIcon && (
                      <Image
                        src={classPassive.icon}
                        key={i}
                        width={60}
                        height={60}
                        alt=""
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {servant.noblePhantasms.map((noblePhantasm, i) => {
                return (
                  <div
                    key={i}
                    style={{ minWidth: "70%" }}
                    className="p-2 bg-slate-600 rounded"
                  >
                    {isShowNobleRuby && <p>{noblePhantasm.ruby}</p>}
                    {isShowNoble && <p>{noblePhantasm.name}</p>}
                    {!isShowNoble && isShowNobleD && (
                      <p>{noblePhantasm.dummyName}</p>
                    )}
                    {isShowNobleDetail && (
                      <p className="text-sm">{noblePhantasm.detail}</p>
                    )}
                    <p>ランク：{isShowNobleRank && noblePhantasm.rank}</p>
                    <p>宝具種別：{isShowNobleType && noblePhantasm.type}</p>
                    <p>カード：{isShowNobleCard && noblePhantasm.card}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <button
        className="fixed top-4 right-4 p-4 bg-gray-800 text-white rounded-md"
        onClick={handleReload}
      >
        <FiRefreshCw size={20} />
      </button>
    </div>
  );
};

interface Props {
  servantData: ServantData[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const servantData = await fetchServantData();

  return {
    props: {
      servantData,
    },
  };
};

export default Index;
