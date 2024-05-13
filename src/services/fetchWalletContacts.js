import axios from "axios";

export async function fetchWalletContacts(matricula, cpfCnpj) {
  const requestOptions = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_WALLET_URL}/fetchWalletContacts`,
    params: {
      matricula,
      cpfCnpj: cpfCnpj,
    }
  };

  const { data } = await axios(requestOptions);

  return data;
}
