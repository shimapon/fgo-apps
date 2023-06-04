import axios from "axios";

export interface ServantData {
  name: string;
  rarity: number;
  faces: string[];
  gender: string;
  className: string;
  attribute: string;
  skills: {
    num: number;
    name: string;
    detail: string;
    icon: string;
  }[];
  isShowSkill: number;
  isShowSkillName: number;
  noblePhantasms: {
    name: string;
    dummyName: string;
    hiddenName: string;
    card: string;
    rank: string;
    type: string;
    ruby: string;
    hiddenRuby: string;
    detail: string;
  }[];
  classPassives: {
    name: string;
    detail: string;
    icon: string;
  }[];
  hiddenType: "PART_A" | "PART_B" | "PART_C" | "ALL";
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
      skills: data.skills.reduce((acc: any, skill: any) => {
        const existingSkill = acc.find((s: any) => s.num === skill.num);

        if (existingSkill) {
          // 既に同じnumを持つスキルが存在する場合、後の要素で優先させる
          const index = acc.indexOf(existingSkill);
          acc.splice(index, 1, skill);
        } else {
          // numが重複しない場合はそのまま追加
          acc.push({
            num: skill.num,
            name: skill.name,
            icon: skill.icon,
            detail: skill.detail,
          });
        }

        return acc;
      }, []),
      isShowSkill: Math.floor(Math.random() * 3),
      isShowSkillName: Math.floor(Math.random() * data.skills.length),
      noblePhantasms: [
        {
          name: data.noblePhantasms[data.noblePhantasms.length - 1].name,
          dummyName: replaceNonSymbols(
            data.noblePhantasms[data.noblePhantasms.length - 1].name
          ),
          hiddenName: replaceNonAll(
            data.noblePhantasms[data.noblePhantasms.length - 1].name
          ),
          detail: data.noblePhantasms[data.noblePhantasms.length - 1].detail,
          card: data.noblePhantasms[data.noblePhantasms.length - 1].card,
          rank: data.noblePhantasms[data.noblePhantasms.length - 1].rank,
          type: data.noblePhantasms[data.noblePhantasms.length - 1].type,
          ruby: data.noblePhantasms[data.noblePhantasms.length - 1].ruby,
          hiddenRuby: replaceNonAll(
            data.noblePhantasms[data.noblePhantasms.length - 1].ruby
          ),
        },
      ],
      classPassives: data.classPassive.map((skill: any) => {
        return {
          name: skill.name,
          detail: skill.detail,
          icon: skill.icon,
        };
      }),
      hiddenType: getHiddenType() as "PART_A" | "PART_B" | "PART_C" | "ALL",
    };

    servantData.push(servant);
  }

  return servantData;
}

function getHiddenType() {
  const hiddenTypeOptions = ["PART_A", "PART_B", "PART_C"];
  const randomHiddenType =
    hiddenTypeOptions[Math.floor(Math.random() * hiddenTypeOptions.length)];
  return randomHiddenType;
}

function replaceNonSymbols(str: string): string {
  // ランダムな位置のインデックスを生成
  const randomIndex1 = Math.floor(Math.random() * str.length);
  let randomIndex2 = Math.floor(Math.random() * str.length);
  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * str.length);
  }

  // 置換後の文字列を生成
  let replacedText = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (
      i === randomIndex1 ||
      i === randomIndex2 ||
      char === "〜" ||
      char === "・"
    ) {
      replacedText += char;
    } else {
      replacedText += "■";
    }
  }

  return replacedText;
}

function replaceNonAll(str: string): string {
  const regex = /[^A-Za-z0-9\s・〜]/g;
  return str.replace(regex, "■");
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
