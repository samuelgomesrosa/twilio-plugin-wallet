import { useEffect, useState } from "react";
import {
  fetchContentTemplates,
  fetchWorkerMatricula,
  sendContentTemplate,
} from "../services/index";
import { showNotification } from "../utils/index";

function useTemplateManager({
  customerNumber,
  manager,
  flex,
  cpfCnpj,
  onClose,
  setCustomerInfoModalIsOpen,
}) {
  const [state, setState] = useState({
    templates: [],
    contentSid: "",
    templateBody: "",
    displayedTemplateBody: "",
    templateVariables: [],
    userVariableValues: {},
    isCharacterLimitExceeded: {},
    characterCounts: {},
  });

  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { templates } = await fetchContentTemplates();
        setState((s) => ({ ...s, templates }));
      } catch (error) {
        console.error("Erro ao buscar os templates:", error);
      }
    }
    fetchTemplates();
  }, []);

  useEffect(() => {
    const buildDisplayedTemplateBody = () => {
      if (!state.templateBody || !state.templateVariables.length) {
        return state.templateBody;
      }

      return state.templateVariables.reduce((currentBody, _, index) => {
        const placeholder = `{{${index + 1}}}`;
        const variableValue = state.userVariableValues[index] || placeholder;
        return currentBody.replace(
          new RegExp(escapeRegExp(placeholder), "g"),
          variableValue
        );
      }, state.templateBody);
    };

    const updatedTemplateBody = buildDisplayedTemplateBody();
    setState((s) => ({ ...s, displayedTemplateBody: updatedTemplateBody }));
  }, [state.userVariableValues, state.templateVariables, state.templateBody]);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const handleSelectTemplate = (event) => {
    const { value } = event.target;
    const resetState = {
      templateVariables: [],
      userVariableValues: {},
      isCharacterLimitExceeded: {},
      characterCounts: {},
    };

    if (value !== state.contentSid) {
      setState((s) => ({ ...s, ...resetState }));
    }

    const selectedTemplate = state.templates.find(
      (template) => template.sid === value
    );

    setSendButtonDisabled(false);

    if (selectedTemplate) {
      setState((s) => ({
        ...s,
        contentSid: value,
        templateBody: selectedTemplate.body,
        displayedTemplateBody: selectedTemplate.body,
        templateVariables: selectedTemplate.variables
          ? Object.values(selectedTemplate.variables)
          : [],
      }));
    }
  };

  const handleChange = (index, value) => {
    const newLimits = { ...state.isCharacterLimitExceeded };
    const newCharacterCounts = { ...state.characterCounts };
    const newUserVariableValues = { ...state.userVariableValues };

    if (value.length >= 240) {
      value = value.slice(0, 240);

      newLimits[index] = true;
      newCharacterCounts[index] = 0;

      setSendButtonDisabled(true);

      setState((s) => ({
        ...s,
        isCharacterLimitExceeded: newLimits,
        characterCounts: newCharacterCounts,
      }));
    }

    setSendButtonDisabled(false);

    newUserVariableValues[index] = value;

    newLimits[index] = value.length === 240;
    newCharacterCounts[index] = Math.max(0, 240 - value.length);

    setState((s) => ({
      ...s,
      userVariableValues: newUserVariableValues,
      isCharacterLimitExceeded: newLimits,
      characterCounts: newCharacterCounts,
    }));
  };

  const handleSendContentTemplate = async () => {
    if (!state.contentSid || !customerNumber) return;

    const workerSid = manager.workerClient.sid;

    setSendButtonDisabled(true);

    try {
      const { matricula } = await fetchWorkerMatricula(workerSid);
      await sendContentTemplate(
        state.contentSid,
        customerNumber,
        state.userVariableValues,
        matricula,
        cpfCnpj
      );
      showNotification(flex, customerNumber);
      onClose();
      setCustomerInfoModalIsOpen(true);
    } catch (error) {
      console.error("Erro ao enviar template de conteúdo:", error);
    }
  };

  return {
    state,
    handleSelectTemplate,
    handleChange,
    handleSendContentTemplate,
    sendButtonDisabled,
  };
}

export default useTemplateManager;
