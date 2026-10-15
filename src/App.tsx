import { useQuery } from "@tanstack/react-query";

import { fetchCurrencies } from "./api/rates";

const CurrencySelect = () => {
  const currenciesQuery = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    staleTime: 60 * 60 * 1000,
  });

  if (currenciesQuery.isPending) {
    return <span>{"Loading..."}</span>;
  }

  if (currenciesQuery.isError) {
    return <span>{"Something went wrong..."}</span>;
  }
  return (
    <select>
      {Object.keys(currenciesQuery.data).map((code) => (
        <option key={code} value={code}>
          {code + ": " + currenciesQuery.data[code]}
        </option>
      ))}
    </select>
  );
};

function App() {
  return (
    <>
      <CurrencySelect />
    </>
  );
}
export default App;
