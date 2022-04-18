import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinTickers } from "../api";
import { PriceData } from "./coin";
import { motion } from "framer-motion";
interface IPriceProps {
  coinId: string;
}
const Container = styled.div``;

const InfoContainer = styled(motion.div)``;

const ChangeRate = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
  width: 100%;
  height: 40px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
`;

const PureText = styled.span`
  color: white;
`;

const InfoText = styled.span<{ isMinus?: Boolean }>`
  color: ${(props) => (props.isMinus ? "skyBlue" : "red")};
`;

const boxVariants = {
  start: { opacity: 0 },
  end: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const innerVariants = {
  start: { opacity: 0 },
  end: {
    opacity: 1,
  },
};

function Price({ coinId }: IPriceProps) {
  const { data: priceData, isLoading } = useQuery<PriceData>(
    [coinId, "PriceData"],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 6000,
    }
  );

  return (
    <Container>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <InfoContainer variants={boxVariants} initial="start" animate="end">
            <ChangeRate variants={innerVariants}>
              <PureText>Price changed in 15m :</PureText>
              <InfoText
                isMinus={
                  priceData?.quotes.USD.percent_change_15m
                    .toString()
                    .slice(0, 1) === "-"
                }
              >
                {`${priceData?.quotes.USD.percent_change_15m} %`}
              </InfoText>
            </ChangeRate>
            <ChangeRate variants={innerVariants}>
              <PureText>Price changed in 30m :</PureText>
              <InfoText
                isMinus={
                  priceData?.quotes.USD.percent_change_30m
                    .toString()
                    .slice(0, 1) === "-"
                }
              >
                {`${priceData?.quotes.USD.percent_change_30m} %`}
              </InfoText>
            </ChangeRate>
            <ChangeRate variants={innerVariants}>
              <PureText>Price changed in 1h :</PureText>
              <InfoText
                isMinus={
                  priceData?.quotes.USD.percent_change_1h
                    .toString()
                    .slice(0, 1) === "-"
                }
              >
                {`${priceData?.quotes.USD.percent_change_1h} %`}
              </InfoText>
            </ChangeRate>
            <ChangeRate variants={innerVariants}>
              <PureText>Price changed in 6h :</PureText>
              <InfoText
                isMinus={
                  priceData?.quotes.USD.percent_change_6h
                    .toString()
                    .slice(0, 1) === "-"
                }
              >
                {`${priceData?.quotes.USD.percent_change_6h} %`}
              </InfoText>
            </ChangeRate>
            <ChangeRate variants={innerVariants}>
              <PureText>Price changed in 24h :</PureText>
              <InfoText
                isMinus={
                  priceData?.quotes.USD.percent_change_24h
                    .toString()
                    .slice(0, 1) === "-"
                }
              >
                {`${priceData?.quotes.USD.percent_change_24h} %`}
              </InfoText>
            </ChangeRate>
            <ChangeRate variants={innerVariants}>
              <PureText>Price changed in 7d :</PureText>
              <InfoText
                isMinus={
                  priceData?.quotes.USD.percent_change_7d
                    .toString()
                    .slice(0, 1) === "-"
                }
              >
                {`${priceData?.quotes.USD.percent_change_7d} %`}
              </InfoText>
            </ChangeRate>
          </InfoContainer>
        </>
      )}
    </Container>
  );
}

export default Price;
