import { useQuery } from "@tanstack/react-query";

import { fetchCurrencies } from "../../api/rates";

export const CurrencySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) => {
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
    <select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value)
      }
    >
      {Object.keys(currenciesQuery.data).map((code) => (
        <option key={code} value={code}>
          {code + ": " + currenciesQuery.data[code]}
        </option>
      ))}
    </select>
  );
};
