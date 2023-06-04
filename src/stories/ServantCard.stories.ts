import type { Meta, StoryObj } from "@storybook/react";

import ServantCard from "./ServantCard";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ServantCard> = {
  title: "ServantCard",
  component: ServantCard,
  args: {
    servant: {
      hiddenType: "PART_A",
      name: "長尾景虎",
      rarity: 4,
      className: "ランサー",
      faces: ["https://static.atlasacademy.io/JP/Faces/f_3038000.png"],
      gender: "女性",
      attribute: "人",
      skills: [
        {
          num: 1,
          name: "運は天に在り A",
          icon: "https://static.atlasacademy.io/JP/SkillIcons/skill_00305.png",
          detail:
            "自身のArtsカード性能をアップ(1ターン)＆スター集中度をアップ(1ターン)",
        },
        {
          num: 2,
          name: "鎧は胸に在り A",
          icon: "https://static.atlasacademy.io/JP/SkillIcons/skill_00402.png",
          detail: "自身に回避状態を付与(1ターン)＆NP獲得量をアップ(1ターン)",
        },
        {
          num: 3,
          name: "手柄は足に在り A",
          icon: "https://static.atlasacademy.io/JP/SkillIcons/skill_00300.png",
          detail:
            "味方全体の攻撃力をアップ(3ターン)＆クリティカル威力をアップ(3ターン)＆スター発生率をアップ(3ターン)",
        },
      ],
      isShowSkill: 1,
      isShowSkillName: 1,
      noblePhantasms: [
        {
          name: "毘天八相車懸りの陣",
          dummyName: "■■■■■■■の陣",
          hiddenName: "■■■■■■■■■",
          detail:
            "敵単体に超強力な攻撃＆攻撃強化状態を解除＆クリティカル発生率をダウン(3ターン)<オーバーチャージで効果アップ>",
          card: "arts",
          rank: "B",
          type: "対人・対軍宝具",
          ruby: "びてんはっそうくるまがかりのじん",
          hiddenRuby: "■■■■■■■■■■■■■■■■■■",
        },
      ],
      classPassives: [
        {
          name: "対魔力 C",
          detail: "自身の弱体耐性を少しアップ",
          icon: "https://static.atlasacademy.io/JP/SkillIcons/skill_00100.png",
        },
        {
          name: "騎乗 C",
          detail: "自身のQuickカードの性能を少しアップ",
          icon: "https://static.atlasacademy.io/JP/SkillIcons/skill_00102.png",
        },
        {
          name: "神性 C",
          detail: "自身に与ダメージプラス状態を付与",
          icon: "https://static.atlasacademy.io/JP/SkillIcons/skill_00326.png",
        },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ServantCard>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ALL: Story = {
  args: {
    hiddenType: "ALL",
  },
};

export const None: Story = {
  args: {
    hiddenType: "PART_A",
  },
};
