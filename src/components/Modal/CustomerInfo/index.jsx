import React, { useRef, useEffect, useState } from "react";
import { SendIcon } from "@twilio-paste/icons/esm/SendIcon";
import { SMSCapableIcon } from "@twilio-paste/icons/esm/SMSCapableIcon";

import { SendContentTemplate } from "../SendContentTemplate";
import styles from "./Styles.module.css";

import { fetchWalletContacts } from "../../../services/fetchWalletContacts";
import { sendContentTemplate } from "../../../services/sendContentTemplate";
import { fetchSentTemplateMessage } from "../../../services/fetchSentTemplateMessage";
import { showNotification } from "../../../utils/showNotification";
import { Icon } from "@twilio/flex-ui";

export function CustomerInfo({
  onClose,
  matricula,
  cgcCpfCliente,
  nmCliente,
  nrCliente,
  manager,
  flex,
  setCustomerInfoModalIsOpen,
}) {
  const [customerContacts, setCustomerContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSendTemplateModalOpen, setIsSendTemplateModalOpen] = useState(false);
  const [selectedCustomerNumber, setSelectedCustomerNumber] = useState(null);

  const modalRef = useRef();

  const workerRoles = manager.workerClient.attributes.roles;

  useEffect(() => {
    fetchWalletContacts(matricula, cgcCpfCliente)
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (customerData) => {
            try {
              const lastTemplateDate = (
                await fetchSentTemplateMessage(customerData.telefone)
              ).date;
              customerData.date =
                lastTemplateDate.split("T")[0].split("-").reverse().join("/") +
                  " (" +
                  lastTemplateDate.split("T")[1].split(".")[0] +
                  ")" || "-";
            } catch (error) {
              customerData.date = "-";
            }

            return customerData;
          })
        );

        setCustomerContacts(updatedData);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handleClickToCloseModal(event) {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }

  function handleChangeModal(telefone) {
    setSelectedCustomerNumber(telefone);
    setIsSendTemplateModalOpen(true);
  }

  function handleCloseSendTemplateModal() {
    setIsSendTemplateModalOpen(false);
  }

  function handleSendServiceEvaluationTemplate(telefone) {
    const serviceEvaluationTemplateSid =
      process.env.REACT_APP_SERVICE_EVALUATION_TEMPLATE_SID;

    showNotification(flex);
    sendContentTemplate(serviceEvaluationTemplateSid, telefone);
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickToCloseModal);

    return () => {
      document.removeEventListener("mousedown", handleClickToCloseModal);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} ref={modalRef}>
        <header className={styles.modalHeader}>
          <h2>
            Cliente {nmCliente} ({nrCliente})
          </h2>
          <span onClick={onClose}>&times;</span>
        </header>
        <div className={styles.modalContent}>
          {error ? (
            <p>Não foi possível carregar as informações do cliente.</p>
          ) : isLoading ? (
            <div>Carregando informações do cliente...</div>
          ) : isSendTemplateModalOpen ? (
            <SendContentTemplate
              customerNumber={selectedCustomerNumber}
              onClose={handleCloseSendTemplateModal}
              manager={manager}
              flex={flex}
              setCustomerInfoModalIsOpen={setCustomerInfoModalIsOpen}
              cpfCnpj={cgcCpfCliente}
            />
          ) : (
            <table className={styles.customerTable}>
              <thead>
                <tr>
                  <td>Número</td>
                  <td>Nome do Contato</td>
                  <td>Telefone</td>
                  <td>E-mail</td>
                  <td>Data e horário</td>
                  <td>Ações</td>
                </tr>
              </thead>
              <tbody>
                {customerContacts.length > 0 ? (
                  customerContacts.map(
                    ({ nome, telefone, email, temWhatsapp, date }, index) => (
                      <tr key={nome}>
                        <td>{index}</td>
                        <td>{nome}</td>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          {telefone}
                          &nbsp;
                          {temWhatsapp === "S" ? (
                            <Icon icon="Whatsapp" />
                          ) : null}
                        </td>

                        <td>{email}</td>
                        <td>{date}</td>
                        <td className={styles.actionsContainer}>
                          {workerRoles.includes("agent") ? null : (
                            <button
                              className={styles.tableButton}
                              onClick={() =>
                                handleSendServiceEvaluationTemplate(telefone)
                              }
                            >
                              <SendIcon
                                decorative={false}
                                title="Enviar pesquisa de satisfação"
                                size={24}
                              />
                            </button>
                          )}
                          <button
                            className={styles.tableButton}
                            onClick={() => handleChangeModal(telefone)}
                          >
                            <SMSCapableIcon
                              decorative={false}
                              title="Enviar mensagem ativa"
                              size={24}
                            />
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="4">Nenhuma informação encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
