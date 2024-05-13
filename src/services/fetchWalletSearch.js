import axios from "axios";

export async function fetchWalletSearch({
  matricula,
  selectedFilter,
  searchTerm,
}) {
  const requestOptions = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_WALLET_URL}/fetchSearchCustomer`,
    params: {
      matricula,
      selectedFilter,
      searchTerm,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  };

  const { data } = await axios(requestOptions);

  return data;
}
