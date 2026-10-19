import { useState } from "react";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { CurrencySelect } from "../CurrencySelect";

import { fetchLatest } from "../../api/rates";

export const Converter = () => {
  const [amount, setAmount] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const query = useQuery({
    queryKey: ["converter", baseCurrency, targetCurrency],
    queryFn: () => fetchLatest(baseCurrency, targetCurrency),
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  if (query.isPending) {
    return <span>{"Loading..."}</span>;
  }

  const [shownCurrency, rate] = Object.entries(query.data?.rates ?? {})[0] ?? [
    targetCurrency,
    0,
  ];

  const targetAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: shownCurrency,
  }).format(amount * rate);

  return (
    <>
      <input
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAmount(Number(e.target.value))
        }
      />
      <CurrencySelect
        value={baseCurrency}
        onChange={(code) => setBaseCurrency(code)}
      />
      <button
        onClick={() => {
          setBaseCurrency(targetCurrency);
          setTargetCurrency(baseCurrency);
        }}
      >
        Swap
      </button>
      {query.isError ? (
        <>
          <span style={{ color: "red" }}>{query.error.message}</span>
          <button onClick={() => query.refetch()}>Retry</button>
        </>
      ) : (
        <span style={{ opacity: query.isPlaceholderData ? 0.5 : 1 }}>
          {targetAmount}
        </span>
      )}
      <CurrencySelect
        value={targetCurrency}
        onChange={(code) => setTargetCurrency(code)}
      />
    </>
  );
};
