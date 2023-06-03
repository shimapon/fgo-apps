import axios from "axios";

export interface ServantData {
  name: string;
  rarity: number;
  faces: string[];
  gender: string;
  className: string;
  attribute: string;
  skills: {
    name: string;
    detail: string;
    icon: string;
  }[];
  isShowSkill: number;
  isShowSkillName: number;
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
  }[];
}

export async function fetchServantData(): Promise<ServantData[]> {
  const servantData: ServantData[] = [];
  const ServerAllCount = 372;
  const excludedNumbers = [149, 151, 152];
  const randomNumbers: number[] = [];

  while (randomNumbers.length < 5) {
    const randomNumber = Math.floor(Math.random() * ServerAllCount) + 1;
    if (
      !randomNumbers.includes(randomNumber) &&
      !excludedNumbers.includes(randomNumber)
    ) {
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
      className: クラス名(data.className),
      faces:
        data.extraAssets.faces && data.extraAssets.faces.ascension["1"]
          ? [data.extraAssets.faces.ascension["1"]]
          : [],
      gender: 性別(data.gender),
      attribute: 天地人(data.attribute),
      skills: data.skills.map((skill: any) => {
        return {
          name: skill.name,
          icon: skill.icon,
          detail: skill.detail,
        };
      }),
      isShowSkill: Math.floor(Math.random() * data.skills.length),
      isShowSkillName: Math.floor(Math.random() * data.skills.length),
      noblePhantasms: [
        {
          name: data.noblePhantasms[data.noblePhantasms.length - 1].name,
          dummyName: replaceNonSymbols(
            data.noblePhantasms[data.noblePhantasms.length - 1].name
          ),
          detail: data.noblePhantasms[data.noblePhantasms.length - 1].detail,
          card: data.noblePhantasms[data.noblePhantasms.length - 1].card,
          rank: data.noblePhantasms[data.noblePhantasms.length - 1].rank,
          type: data.noblePhantasms[data.noblePhantasms.length - 1].type,
          ruby: data.noblePhantasms[data.noblePhantasms.length - 1].ruby,
        },
      ],
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

  var num = 1;

  if (str.length >= 7 && str.length <= 9) {
    num = 2;
  }
  if (str.length > 9) {
    num = 3;
  }

  const lastTwoChars = str.slice(-num); // 文字列の後ろから二文字を取得
  const replacedString = str.slice(0, -num).replace(regex, "■"); // 後ろから二文字以外の部分を置換
  return replacedString + lastTwoChars; // 置換した部分と後ろ二文字を結合して返す
}

const クラス名 = (className: string) => {
  switch (className) {
    case "shielder":
      return "シールダー";
    case "saber":
      return "セイバー";
    case "archer":
      return "アーチャー";
    case "lancer":
      return "ランサー";
    case "rider":
      return "ライダー";
    case "caster":
      return "キャスター";
    case "assassin":
      return "アサシン";
    case "berserker":
      return "バーサーカー";
    case "ruler":
      return "ルーラー";
    case "avenger":
      return "アヴェンジャー";
    case "alterEgo":
      return "アルターエゴ";
    case "moonCancer":
      return "ムーンキャンサー";
    case "foreigner":
      return "フォーリナー";
    case "pretender":
      return "プリテンダー";
    case "beast":
      return "ビースト";
    default:
      return "その他";
  }
};

const 天地人 = (attribute: string) => {
  switch (attribute) {
    case "human":
      return "人";
    case "earth":
      return "地";
    case "sky":
      return "天";
    case "star":
      return "星";
    case "beast":
      return "獣";
    case "void":
      return "ヴォイド";
    default:
      return "その他";
  }
};

const 性別 = (gender: string) => {
  switch (gender) {
    case "male":
      return "男性";
    case "female":
      return "女性";
    default:
      return "不明";
  }
};
