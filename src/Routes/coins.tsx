import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";
import { motion, AnimatePresence } from "framer-motion";
import TypeIt from "typeit-react";
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
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
  margin-bottom: 10px;
  border: 1px solid white;
  a {
    padding: 20px;
    display: block;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
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

const ToggleButton = styled.button`
  position: absolute;
  top: 25px;
  right: 0px;
  border-radius: 5px;
  padding: 7px;
  border: none;
  background-color: green;
  color: ${(props) => props.theme.bgColor};
  cursor: pointer;
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
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 25px;
`;

const Button = styled.span`
  font-size: 40px;
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
  cursor: pointer;
`;

const OFFSET = 6;

function Coins() {
  const setterFn = useSetRecoilState(isDarkAtom);
  const { data, isLoading } = useQuery<CoinInterface[]>("allCoins", fetchCoins);

  const [page, setPage] = useState({ count: 0, left: false });
  return (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>Coins</title>
        </Helmet>
        <Header>
          <Title>
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

        <ToggleButton onClick={() => setterFn((prev) => !prev)}>
          Toggle
        </ToggleButton>

        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <AnimatePresence initial={false}>
            <div>
              <CoinList
                key={page.count}
                initial={
                  page.left
                    ? { x: -window.outerWidth }
                    : { x: window.outerWidth }
                }
                animate={{ x: 0 }}
                exit={
                  page.left
                    ? { x: -window.outerWidth }
                    : { x: -window.outerWidth }
                }
                transition={{ duration: 0.7 }}
              >
                {data
                  ?.slice(0, 100)
                  .slice(OFFSET * page.count, OFFSET * page.count + OFFSET)
                  .map((coin) => (
                    <Coin key={coin.id} whileHover={{ scale: 1.1 }}>
                      <Link
                        to={{
                          pathname: `/${coin.id}`,
                          state: { name: coin.name, coinId: coin.id },
                        }}
                      >
                        <CoinWrapper>
                          <CoinImage
                            alt="coin images"
                            src={`https://cryptocurrencyliveprices.com/img/${coin?.id}.png`}
                          />
                          {coin.name} &rarr;
                        </CoinWrapper>
                      </Link>
                    </Coin>
                  ))}
              </CoinList>
            </div>
          </AnimatePresence>
        )}
        <ButtonBox>
          <Button
            onClick={() =>
              setPage((curr) => {
                if (curr.count < 0) return { ...curr, left: true, count: 16 };
                return { ...curr, left: true, count: curr.count-- };
              })
            }
          >
            ⇠
          </Button>
          <Button
            onClick={() =>
              setPage((curr) => {
                if (curr.count > 16) return { ...curr, left: false, count: 0 };
                return { ...curr, left: false, count: curr.count++ };
              })
            }
          >
            ⇢
          </Button>
        </ButtonBox>
      </HelmetProvider>
    </Container>
  );
}
export default Coins;
