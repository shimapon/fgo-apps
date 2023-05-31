import axios from "axios";

export interface ServantData {
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
    dummyName: string;
    card: string;
    rank: string;
    type: string;
    ruby: string;
    detail: string;
  }[];
  classPassives: {
    name: string;
    detail: string;
    icon: string;
  };
}

export async function fetchServantData(): Promise<ServantData[]> {
  const servantData: ServantData[] = [];
  const ServerAllCount = 372;
  const randomNumbers: number[] = [];

  // 1からServerAllCountまでのランダムな5つの数字を生成
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
          dummyName: replaceNonSymbols(noblePhantasm.name),
          detail: noblePhantasm.detail,
          card: noblePhantasm.card,
          rank: noblePhantasm.rank,
          type: noblePhantasm.type,
          ruby: noblePhantasm.ruby,
        };
      }),
      classPassives: data.classPassive.map((skill: any) => {
        return {
          name: skill.name,
          detail: skill.detail,
          icon: skill.icon,
        };
      }),
    };
    servantData.push(servant);
  }

  return servantData;
}

function replaceNonSymbols(str: string): string {
  const regex = /[^A-Za-z0-9\s・〜]/g;
  const lastTwoChars = str.slice(-2); // 文字列の後ろから二文字を取得
  const replacedString = str.slice(0, -2).replace(regex, "■"); // 後ろから二文字以外の部分を置換
  return replacedString + lastTwoChars; // 置換した部分と後ろ二文字を結合して返す
}
