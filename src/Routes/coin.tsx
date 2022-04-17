import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet, HelmetProvider } from "react-helmet-async";
import TypeIt from "typeit-react";
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 36px;
  margin-right: 7px;
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
  align-items: center;
  justify-content: center;
`;

const Loader = styled.h1`
  font-size: 24px;
  color: white;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: Boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

const GoBack = styled.span`
  font-size: 20px;
  position: absolute;
  top: 17px;
  padding: 13px;
  &:hover {
    color: green;
  }
  cursor: pointer;
`;

const CoinImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
  coinId: string;
}
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

export interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch(`/${coinId}/price`);
  const chartMatch = useRouteMatch(`/${coinId}/chart`);
  const history = useHistory();
  const { data: infoData, isLoading: infoLoading } = useQuery<InfoData>(
    ["Info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { data: tickersData, isLoading: tickersLoading } = useQuery<PriceData>(
    ["Tickers", coinId],
    () => fetchCoinTickers(coinId),
    { refetchInterval: 5000 }
  );

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>
            {state?.name ? state.name : loading ? "Loading" : infoData?.name}
          </title>
        </Helmet>
        <GoBack onClick={() => history.push(`/`)}>↩︎</GoBack>
        <Header>
          <Title>
            <TypeIt
              options={{
                afterComplete: function ({ destroy }: any) {
                  destroy();
                },
              }}
            >
              {state?.name ? state.name : loading ? "Loading" : infoData?.name}
            </TypeIt>
          </Title>
          <CoinImage
            src={`https://cryptocurrencyliveprices.com/img/${coinId}.png`}
          />
        </Header>

        {loading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Overview>
              <OverviewItem>
                <span>Rank:</span>
                <span>{infoData?.rank}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Symbol:</span>
                <span>${infoData?.symbol}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Price:</span>
                <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
              </OverviewItem>
            </Overview>
            <Description>{infoData?.description}</Description>
            <Overview>
              <OverviewItem>
                <span>Total Supply:</span>
                <span>{tickersData?.total_supply}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Max Supply:</span>
                <span>{tickersData?.max_supply}</span>
              </OverviewItem>
            </Overview>

            <Tabs>
              <Tab isActive={chartMatch !== null}>
                <Link to={`/${coinId}/chart`}>Chart</Link>
              </Tab>
              <Tab isActive={priceMatch !== null}>
                <Link to={`/${coinId}/price`}>Price</Link>
              </Tab>
            </Tabs>

            <Switch>
              <Route path={`/${coinId}/chart`}>
                <Chart coinId={coinId} />
              </Route>
              <Route path={`/${coinId}/price`}>
                <Price coinId={coinId} />
              </Route>
            </Switch>
          </>
        )}
      </HelmetProvider>
    </Container>
  );
}
export default Coin;
