import axios from "axios";
import { formatNumber } from "../utils/formatCustomerNumber";

export async function fetchSentTemplateMessage(customerNumber) {
  const formattedCustomerNumber = formatNumber(customerNumber);

  const options = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_SYNC_URL}/fetchSentTemplateMessage`,
    params: {
      customerNumber: `whatsapp:+55${formattedCustomerNumber}`,
    },
  };

  const { data } = await axios(options);

  return data;
};