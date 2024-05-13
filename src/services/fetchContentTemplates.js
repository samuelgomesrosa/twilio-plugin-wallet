import axios from "axios";

export async function fetchContentTemplates() {
  const requestOptions = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_MESSAGE_TEMPLATES_URL}/fetchContentTemplates`,
  };

  const { data } = await axios(requestOptions);

  return data;
}
