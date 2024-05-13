import axios from "axios";

export async function sendContentTemplate(
  contentSid,
  to,
  variables,
  matricula,
  cpfCnpj
) {
  const params = {
    contentSid,
    to: `whatsapp:+55${to}`,
    matricula,
    cpfCnpj,
  };

  if (variables) {
    const variablesValues = Object.values(variables);

    variablesValues.forEach((variable, index) => {
      params[`variable${index + 1}`] = variable;
    });
  }

  const requestOptions = {
    method: "GET",
    url: `${process.env.REACT_APP_SERVICE_MESSAGE_TEMPLATES_URL}/sendContentTemplate`,
    params,
  };

  const { data } = await axios(requestOptions);

  return data;
}
