import styles from "./styles.module.css";

export function TemplateInput({ index, state, setState }) {
  const handleInputChange = (event) => setState(index, event.target.value);

  return (
    <div className={styles.variableContainer}>
      <label htmlFor={`variable-input-${index}`} className={styles.label}>
        Variável {index + 1}
      </label>
      <input
        id={`variable-input-${index}`}
        placeholder={`Conteúdo da variável ${index + 1}`}
        className={`${
          state.isCharacterLimitExceeded[index]
            ? styles.inputErrorCharacterLimitExceeded
            : ""
        }`}
        value={state.userVariableValues[index] || ""}
        onChange={handleInputChange}
      />
      <span className={styles.characterCount}>
        {state.characterCounts[index] !== undefined
          ? state.characterCounts[index]
          : 240}{" "}
        caracteres restantes
      </span>
      {state.isCharacterLimitExceeded[index] && (
        <p className={styles.characterLimitExceededMessage}>
          O limite de caracteres foi excedido.
        </p>
      )}
    </div>
  );
}
