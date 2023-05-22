import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";

const ServerAllCount = 372;

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

interface ServantData {
  name: string;
  rarity: number;
  faces: string[];
  gender: "male" | "female" | "unknown";
  className:
    | "shielder"
    | "saber"
    | "archer"
    | "lancer"
    | "rider"
    | "caster"
    | "assassin"
    | "berserker"
    | "ruler"
    | "alterEgo"
    | "avenger"
    | "demonGodPiller"
    | "moonCancer"
    | "foreigner"
    | "pretender"
    | "beast";
  attribute: "human" | "earth" | "sky" | "star" | "beast" | "void";
  skills: {
    name: string;
    detail: string;
    icon: string;
  }[];
  noblePhantasms: {
    name: string;
    card: string;
    rank: string;
    type: string;
    ruby: string;
    detail: string;
  }[];
}

interface Props {
  servantData: ServantData[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const servantData: ServantData[] = [];
  const randomNumbers: number[] = [];
  // 1から350までのランダムな5つの数字を生成
  while (randomNumbers.length < 5) {
    const randomNumber = Math.floor(Math.random() * ServerAllCount) + 1;
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }

  // ランダムな5つの数字に対してGETリクエストを実行してデータを取得
  for (const randomNumber of randomNumbers) {
    const response = await axios.get(
      `https://api.atlasacademy.io/nice/JP/servant/${randomNumber}`
    );
    const data = response.data;

    // 必要なデータを抽出してservantDataに追加
    const servant: ServantData = {
      // データの抽出や整形
      // 例: id: data.id, name: data.name, level: data.levelなど
      name: data.name,
      rarity: data.rarity,
      className: data.className,
      faces: [
        data.extraAssets.faces.ascension["1"],
        data.extraAssets.faces.ascension["2"],
        data.extraAssets.faces.ascension["3"],
        data.extraAssets.faces.ascension["4"],
      ],
      gender: data.gender,
      attribute: data.attribute,
      skills: data.skills.map((skill: any) => {
        return {
          name: skill.name,
          icon: skill.icon,
          detail: skill.detail,
        };
      }),
      noblePhantasms: data.noblePhantasms.map((noblePhantasm: any) => {
        return {
          name: noblePhantasm.name,
          detail: noblePhantasm.detail,
          card: noblePhantasm.card,
          rank: noblePhantasm.rank,
          type: noblePhantasm.type,
          ruby: noblePhantasm.ruby,
        };
      }),
    };
    servantData.push(servant);
  }

  return {
    props: {
      servantData,
    },
  };
};

export default Index;
