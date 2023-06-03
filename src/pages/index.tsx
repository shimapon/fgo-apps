import { GetServerSideProps } from "next";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import { fetchServantData, ServantData } from "../../utils/api";
import { useState } from "react";
import ServantCard from "../stories/ServantCard";

const handleReload = () => {
  window.location.reload(); // ページのリロード
};

const Index = ({ servantData }: Props) => {
  return (
    <div className="p-4 text-gray-100">
      {/* <div>
        <button
          className="m-2 w-full p-3 bg-slate-600 rounded"
          onClick={clickRandomSet}
        >
          ランダムに公開
        </button>
        {randomIndex !== null && (
          <p>設定された項目: {stateFunctions[randomIndex].name}</p>
        )}
      </div> */}
      {/* <div className="grid grid-cols-3">
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
      </div> */}
      <h1 className="font-bold">サーヴァント５騎ランダム</h1>
      <div className="flex gap-2 overflow-x-auto">
        {servantData.map((servant, index) => {
          return <ServantCard key={index} servant={servant} hiddenType="ALL" />;
        })}
      </div>
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
