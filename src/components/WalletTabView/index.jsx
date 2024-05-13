import { useEffect, useMemo, useState } from "react";

import { InsertMatricula } from "../Modal/InsertMatricula";
import { CustomerInfo } from "../Modal/CustomerInfo";
import { NumberPagination } from "../Pagination";

import styles from "./Styles.module.css";

import { fetchWallet } from "../../services/fetchWallet";
import { fetchWorkerMatricula } from "../../services/fetchWorkerMatricula";
import { filterWalletItem } from "../../utils/filterWallet";
import { fetchWalletSearch } from "../../services/fetchWalletSearch";

const WalletTabView = ({ manager, flex }) => {
  const [wallet, setWallet] = useState([]);
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState("carregando...");
  const [size, setSize] = useState(100);
  const [countResultElements, setCountResultElements] = useState(0);
  const [searchCustomerWallet, setSearchCustomerWallet] = useState([]);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);
  const [refreshSearch, setRefreshSearch] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("nmCliente");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [customerInfoModalIsOpen, setCustomerInfoModalIsOpen] = useState(false);
  const [insertMatriculaModalIsOpen, setInsertMatriculaModalIsOpen] =
    useState(false);

  const [error, setError] = useState(null);

  // Insere a matrícula do worker no estado e busca a carteira de clientes
  const handleInsertMatricula = (matricula) => {
    setLoading(true);
    setSelectedMatricula(matricula);
  };

  // Abre o modal de informações do cliente
  const openCustomerInfoModal = () => {
    setCustomerInfoModalIsOpen(true);
  };

  // Verifica se o worker possui matrícula cadastrada em seus atributos
  // Caso possua, busca a carteira de clientes do worker
  // Caso não possua, abre o modal para inserção da matrícula
  const handleFetchWorkerMatricula = (workerSid) => {
    try {
      fetchWorkerMatricula(workerSid).then(({ matricula }) => {
        if (matricula) {
          setSelectedMatricula(matricula);
          setInsertMatriculaModalIsOpen(false);
        } else {
          setInsertMatriculaModalIsOpen(true);
          setLoading(false);
        }
      });
    } catch (error) {
      setError(error);
    }
  };

  // Busca a carteira de clientes do worker a partir da matrícula
  const fetchWalletData = async (matricula, page) => {
    try {
      setLoading(true);

      const { content, totalPages, numberOfElements, totalElements } =
        await fetchWallet(matricula, page || 1, size);

      setWallet(content);
      setPagesCount(totalPages);
      setCountResultElements(numberOfElements);
      setCurrentPage(page || 1);
      setTotalCustomersCount(totalElements);

      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  const filteredWallet = useMemo(() => {
    if (searchTerm) {
      setCountResultElements(searchCustomerWallet.length);
      return searchCustomerWallet;
    }

    setCountResultElements(wallet.length);
    return wallet;
  }, [wallet, searchCustomerWallet, refreshSearch]);

  // Renderiza o conteúdo da tabela
  const tableContent = loading ? (
    <tr>
      <td colSpan="5" className={styles.spinner}></td>
    </tr>
  ) : filteredWallet.length > 0 ? (
    filteredWallet.map(
      ({
        cgcCpfCliente,
        cdAgrupamentoCliente,
        nrCliente,
        nmCliente,
        cidade,
        estado,
      }) => (
        <tr key={cgcCpfCliente}>
          <td
            onClick={() => {
              setSelectedCustomer({
                nrCliente,
                nmCliente,
                cgcCpfCliente,
                selectedMatricula,
              });
              openCustomerInfoModal();
            }}
          >
            {nrCliente}
          </td>
          <td>{cgcCpfCliente}</td>
          <td>{cdAgrupamentoCliente}</td>
          <td>{nmCliente}</td>
          <td>{`${cidade} - ${estado}`}</td>
        </tr>
      )
    )
  ) : (
    <tr>
      <td colSpan="5">Nenhum resultado encontrado.</td>
    </tr>
  );

  // Busca a matrícula do worker ao carregar o componente
  useEffect(() => {
    const workerSid = manager.workerClient.sid;

    handleFetchWorkerMatricula(workerSid);
  }, [manager]);

  // Busca a carteira de clientes do worker ao selecionar uma matrícula
  useEffect(() => {
    if (selectedMatricula) {
      const workerSid = manager.workerClient.sid;

      fetchWorkerMatricula(workerSid, selectedMatricula);
      fetchWalletData(selectedMatricula);
    }
  }, [selectedMatricula]);

  useEffect(async () => {
    return handleSearchOpenInput({ key: "Enter" });
  }, [selectedFilter]);

  useEffect(() => {
    if (!searchTerm) return setRefreshSearch(!refreshSearch);
  }, [searchTerm]);

  const handleSearchOpenInput = async (e) => {
    if (e.key == "Enter") {
      if (!selectedMatricula || !searchTerm) return;

      setLoading(true);

      try {
        const searchCustomers = await fetchWalletSearch({
          matricula: selectedMatricula,
          selectedFilter,
          searchTerm,
        });

        if (searchCustomers.length) {
          setSearchCustomerWallet(searchCustomers);
        } else {
          setSearchCustomerWallet([]);
        }
      } catch (error) {
        setSearchCustomerWallet([]);
      }

      setLoading(false);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <header>
        <h2>Carteira de Clientes</h2>
        <div>
          <select
            name="filter"
            style={{ zIndex: 7 }}
            id="filter"
            title="filter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="nmCliente">Nome</option>
            <option value="cgcCpfCliente">CNPJ</option>
            <option value="cdAgrupamentoCliente">Agrupamento</option>
            <option value="nrCliente">Número</option>
          </select>

          <input
            type="text"
            style={{ zIndex: 7 }}
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchOpenInput}
          />
        </div>
      </header>
      <span>
        Total de contatos: {totalCustomersCount} | Esta página:{" "}
        {countResultElements} | Página: {currentPage} / {pagesCount}
      </span>
      {customerInfoModalIsOpen && (
        <CustomerInfo
          onClose={() => setCustomerInfoModalIsOpen(false)}
          matricula={selectedMatricula}
          cgcCpfCliente={selectedCustomer.cgcCpfCliente}
          nmCliente={selectedCustomer.nmCliente}
          nrCliente={selectedCustomer.nrCliente}
          manager={manager}
          flex={flex}
          setCustomerInfoModalIsOpen={setCustomerInfoModalIsOpen}
        />
      )}
      {insertMatriculaModalIsOpen && (
        <InsertMatricula
          onClose={() => setInsertMatriculaModalIsOpen(false)}
          onInsert={handleInsertMatricula}
        />
      )}{" "}
      {loading ? (
        <div className={styles.spinner}></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número cliente</th>
              <th>CNPJ</th>
              <th>Agrupamento</th>
              <th>Nome</th>
              <th>Cidade - UF</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      )}
      {!loading && !searchTerm && (
        <NumberPagination
          selectedMatricula={selectedMatricula}
          fetchWalletData={fetchWalletData}
          pagesCount={pagesCount}
          currentPage={currentPage}
          setSearchTerm={setSearchTerm}
        />
      )}
    </div>
  );
};

export default React.memo(WalletTabView);
