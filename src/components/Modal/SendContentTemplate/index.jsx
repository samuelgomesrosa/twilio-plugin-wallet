import useTemplateManager from "../../../hooks/useTemplateManager";
import { TemplateInput } from "./TemplateInput";
import styles from "./styles.module.css";

export function SendContentTemplate({
  customerNumber,
  onClose,
  manager,
  flex,
  setCustomerInfoModalIsOpen,
  cpfCnpj,
}) {
  const {
    state,
    handleSelectTemplate,
    handleChange,
    handleSendContentTemplate,
    sendButtonDisabled,
  } = useTemplateManager({
    customerNumber,
    manager,
    flex,
    cpfCnpj,
    onClose,
    setCustomerInfoModalIsOpen,
  });

  return (
    <>
      <div className={styles.sendTemplateContainer}>
        <select onChange={handleSelectTemplate} value={state.contentSid}>
          <option value="" disabled>
            Selecione um template
          </option>
          {state.templates.map(({ sid, friendly_name }) => (
            <option key={sid} value={sid}>
              {friendly_name}
            </option>
          ))}
        </select>
        <div className={styles.variablesContainer}>
          {state.templateVariables.map((variable, index) => (
            <TemplateInput
              key={`variable-input-${index}`}
              index={index}
              variable={variable}
              state={state}
              setState={handleChange}
            />
          ))}
        </div>
      </div>
      {state.displayedTemplateBody && (
        <p className={styles.templateText}>{state.displayedTemplateBody}</p>
      )}
      <div className={styles.buttonContainer}>
        <button
          onClick={handleSendContentTemplate}
          disabled={
            sendButtonDisabled ||
            !state.contentSid ||
            state.templateVariables.some(
              (_, index) => state.isCharacterLimitExceeded[index]
            )
          }
        >
          Enviar
        </button>
      </div>
    </>
  );
}
