import { useState } from "react";

import styles from "./Styles.module.css";

export function InsertMatricula({ onClose, onInsert }) {
  const [matricula, setMatricula] = useState("");

  const handleInsert = () => {
    onInsert(matricula);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Inserir Matrícula</h2>
        </div>
        <div className={styles.modalContent}>
          <label htmlFor="matricula">Por favor, insira a sua matrícula:</label>
          <div>
            <input
              type="text"
              id="matricula"
              placeholder="Número de matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
            <button onClick={handleInsert}>Inserir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
