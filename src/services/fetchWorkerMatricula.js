import axios from "axios";

export async function fetchWorkerMatricula(workerSid, matricula) {
  const requestOptions = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_WALLET_URL}/insertWorkerMatricula`,
    params: {
      workerSid,
      matricula,
    },
  };

  const { data } = await axios.request(requestOptions);

  if (data.matricula) {
    return { matricula: data.matricula };
  } else {
    return false;
  }
}
