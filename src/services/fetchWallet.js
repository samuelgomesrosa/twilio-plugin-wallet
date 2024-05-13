import axios from "axios";

export async function fetchWallet(matricula, page, size, cpfCnpj) {
  const requestOptions = {
    method: "GET",
    url: `${process.env.REACT_APP_MAIN_URL}/clientes`,
    params: {
      matricula,
      page: page ? page - 1 : 0,
      size: size || 1000,
      cgcCpfCliente: cpfCnpj ? cpfCnpj : "",
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
