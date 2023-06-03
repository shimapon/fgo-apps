import { GetServerSideProps } from "next";
import { fetchServantData, ServantData } from "../../utils/api";
import ServantCard from "../stories/ServantCard";

const Index = ({ servantData }: Props) => {
  return (
    <div className="p-4 text-gray-100">
      <h1 className="font-bold">サーヴァント５騎ランダム</h1>
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
