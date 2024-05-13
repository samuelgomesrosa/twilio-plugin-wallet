import axios from "axios";
import { formatNumber } from "../utils/formatCustomerNumber";

export async function saveSentTemplateMessage(
  customerNumber,
  agentWallet,
  cpfCnpj
) {
  const formattedCustomerNumber = formatNumber(customerNumber);

  const options = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_SYNC_URL}/saveSentTemplateMessage`,
    params: {
      customerNumber: `whatsapp:+55${formattedCustomerNumber}`,
      agentWallet,
      cpfCnpj,
    },
  };

  const { data } = await axios(options);

  return data;
}
