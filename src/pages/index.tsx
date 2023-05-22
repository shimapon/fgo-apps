import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import { fetchServantData, ServantData } from "../../utils/api";

const handleReload = () => {
  window.location.reload(); // ページのリロード
};

const Index = ({ servantData }: Props) => {
  return (
    <div className="p-4">
      <h1 className="font-bold">サーヴァント５騎ランダム</h1>
      {servantData.map((servant, index) => {
        return (
          <div key={index} className="p-12 mt-2 rounded bg-gray-700">
            <h2 className="font-bold text-lg">{servant.name}</h2>
            <p>レア：{servant.rarity}</p>
            <p>クラス：{servant.className}</p>
            <p>性別：{servant.gender}</p>
            <p>天地人：{servant.attribute}</p>
            <div className="flex gap-2 mt-2">
              {servant.faces.map((face, i) => {
                return (
                  <Image src={face} key={i} width={120} height={120} alt="" />
                );
              })}
            </div>
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {servant.skills.map((skill, i) => {
                return (
                  <div key={i} style={{ minWidth: "28%" }}>
                    <p>{skill.name}</p>
                    <p className="text-sm">{skill.detail}</p>
                    <Image
                      src={skill.icon}
                      key={i}
                      width={60}
                      height={60}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {servant.noblePhantasms.map((noblePhantasm, i) => {
                return (
                  <div key={i} style={{ minWidth: "70%" }}>
                    <p>{noblePhantasm.ruby}</p>
                    <p>{noblePhantasm.name}</p>
                    <p className="text-sm">{noblePhantasm.detail}</p>
                    <p>ランク：{noblePhantasm.rank}</p>
                    <p>宝具種別：{noblePhantasm.type}</p>
                    <p>カード：{noblePhantasm.card}</p>
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
