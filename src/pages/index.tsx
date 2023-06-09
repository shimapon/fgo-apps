import { GetServerSideProps } from "next";
import Head from "next/head";
import { fetchServantData, ServantData } from "../../utils/api";
import ServantCard from "../stories/ServantCard";

const apiURL = "https://api.atlasacademy.io/rapidoc";
const githubRepoURL = "https://github.com/shimapon/fgo-apps";

const Index = ({ servantData }: Props) => {
  return (
    <>
      <Head>
        <title>Fate Servantクイズ</title>
        <meta property="og:title" content="Fate Servantクイズ" key="title" />
        <meta name="description" content="サーヴァントを推測しよう！" />
        <meta name="author" content="shimapon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="p-4 text-gray-100">
        <h1 className="font-bold">サーヴァントクイズ：五騎</h1>
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
          {servantData.map((servant, index) => {
            return (
              <ServantCard
                key={index}
                servant={servant}
                hiddenType={servant.hiddenType}
              />
            );
          })}
        </div>
        <div className="p-6 text-white flex justify-end space-x-4">
          <a
            href={apiURL}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-500"
          >
            利用API
          </a>
          <a
            href={githubRepoURL}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-500"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </>
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
