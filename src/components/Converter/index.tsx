import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
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
  });

  if (query.isPending) {
    return <span>{"Loading..."}</span>;
  }

  if (query.isError) {
    return <span>{"Something went wrong..."}</span>;
  }

  const targetAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: targetCurrency,
  }).format(amount * query.data.rates[targetCurrency]);

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
      <span>{targetAmount} </span>
      <CurrencySelect
        value={targetCurrency}
        onChange={(code) => setTargetCurrency(code)}
      />
    </>
  );
};
