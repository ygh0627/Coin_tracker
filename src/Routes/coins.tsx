import { useQuery } from "react-query";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  motion,
  useTransform,
  useViewportScroll,
  AnimatePresence,
} from "framer-motion";
import TypeIt from "typeit-react";

const Title = styled.h1`
  margin-top: 10px;
  color: white;
  font-size: 48px;
`;

const Wrapper = styled(motion.div)`
  background: linear-gradient(135deg, rgb(238, 0, 153), rgb(221, 0, 238));
`;

const Container = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  padding: 10px 0px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CoinList = styled(motion.ul)`
  padding: 0px 20px;
`;

const Coin = styled(motion.li)`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 27px;
  border: 1px solid white;
  cursor: pointer;
  padding: 20px;
  display: block;
  &:hover {
    color: #9c88ff;
    transition: color 0.2s ease-in-out;
  }
`;

const Loader = styled.h1`
  font-size: 48px;
  color: white;
`;

const CoinImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const CoinWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.7;
`;

const RankText = styled.div`
  font-size: 30px;
  color: white;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InnerText = styled.span`
  margin-bottom: 20px;
`;

const LinkText = styled.span`
  &:hover {
    color: #9c88ff;
  }
  transition: color 0.2s ease-in-out;
  margin-top: 40px;
`;
interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const { scrollYProgress, scrollY } = useViewportScroll();
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ coinId: string }>("/coins/:coinId");
  const { data, isLoading } = useQuery<CoinInterface[]>("allCoins", fetchCoins);
  console.log(data?.slice(0, 15));
  const potato = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "linear-gradient(135deg, rgb(219, 100, 79), rgb(236, 236, 227))",
      "linear-gradient(135deg, rgb(243, 247, 8),rgb(241, 231, 227)",
      "linear-gradient(135deg, rgb(103, 28, 153),rgb(41, 196, 118)))",
    ]
  );
  const onBoxClicked = (coinId: string) => {
    history.push(`/coins/${coinId}`);
  };
  return (
    <Wrapper style={{ background: potato }}>
      <Container>
        <HelmetProvider>
          <Helmet>
            <title>Coins</title>
          </Helmet>
          <Header>
            <Title style={{ marginBottom: "20px" }}>
              <TypeIt
                getBeforeInit={(instance) => {
                  instance
                    .type("Hi, We're 코인")
                    .pause(750)
                    .delete(1)
                    .pause(100)
                    .delete(1)
                    .pause(500)
                    .type("Coins ")
                    .pause(500)
                    .type(":) ");
                  return instance;
                }}
              />
            </Title>
          </Header>

          {/* <ToggleButton onClick={() => setterFn((prev) => !prev)}>
            Toggle
          </ToggleButton> */}

          {isLoading ? (
            <Loader>Loading...</Loader>
          ) : (
            <CoinList>
              {data?.slice(0, 15).map((coin) => (
                <Coin
                  layoutId={coin.id}
                  key={coin.id}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => onBoxClicked(coin.id)}
                >
                  <CoinWrapper>
                    <CoinImage
                      alt="coin images"
                      src={`https://cryptocurrencyliveprices.com/img/${coin?.id}.png`}
                    />
                    {coin.name} &rarr;
                  </CoinWrapper>
                </Coin>
              ))}
            </CoinList>
          )}
        </HelmetProvider>
      </Container>

      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={() => {
                history.push("/");
              }}
            />
            <motion.div
              layoutId={bigMovieMatch.params.coinId}
              style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                width: "40vw",
                position: "absolute",
                height: "40vh",
                top: scrollY.get() + 200,
                right: 0,
                left: 0,
                margin: "0 auto",
              }}
            >
              <TextGroup>
                <Title style={{ marginTop: "20px" }}>
                  <CoinImage
                    src={`https://cryptocurrencyliveprices.com/img/${bigMovieMatch.params.coinId}.png`}
                  />

                  <TypeIt>{bigMovieMatch.params.coinId + " "}</TypeIt>
                </Title>

                <RankText>
                  <InnerText>
                    <TypeIt>
                      {`Rank : ${
                        data
                          ?.slice(0, 15)
                          .find(
                            (coin) => coin.id === bigMovieMatch.params.coinId
                          )?.rank
                      } `}
                    </TypeIt>
                  </InnerText>
                  <InnerText>
                    <TypeIt>
                      {`Type : ${
                        data
                          ?.slice(0, 15)
                          .find(
                            (coin) => coin.id === bigMovieMatch.params.coinId
                          )?.type
                      } `}
                    </TypeIt>
                  </InnerText>
                  <InnerText>
                    <TypeIt>
                      {`Symbol : ${
                        data
                          ?.slice(0, 15)
                          .find(
                            (coin) => coin.id === bigMovieMatch.params.coinId
                          )?.symbol
                      } `}
                    </TypeIt>
                  </InnerText>
                  <Link
                    to={{
                      pathname: `/coins/${bigMovieMatch.params.coinId}/details`,
                      state: { coinId: bigMovieMatch.params.coinId },
                    }}
                  >
                    <LinkText>
                      <TypeIt>{`Wanna more info?  Click Here! `}</TypeIt>
                    </LinkText>
                  </Link>
                </RankText>
              </TextGroup>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}
export default Coins;
