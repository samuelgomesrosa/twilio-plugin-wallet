import styles from "./Styles.module.css";

export function NumberPagination({
  fetchWalletData,
  selectedMatricula,
  pagesCount,
  currentPage,
  setSearchTerm,
}) {
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const goToNextPage = (event) => {
    if (currentPage + 1 > pagesCount) return false;
    fetchWalletData(selectedMatricula, currentPage + 1);
    setSearchTerm("");
    event.preventDefault();
  };

  const goToPreviousPage = (event) => {
    if (currentPage - 1 < 1) return false;
    fetchWalletData(selectedMatricula, currentPage - 1);
    setSearchTerm("");
    event.preventDefault();
  };

  const goToPage = (event) => {
    fetchWalletData(selectedMatricula, parseInt(event.target.innerText));
    setSearchTerm("");
    event.preventDefault();
  };

  let pages_range = pages.slice(
    currentPage < 5 ? 0 : currentPage - 5,
    currentPage < 5 ? currentPage + 9 : currentPage + 5
  );

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pagination}>
        <h3
          className={`${styles.paginationButton} ${
            currentPage == 1 && styles.invisibleButton
          }`}
          onClick={goToPreviousPage}
        >
          Anterior
        </h3>

        <div className={styles.paginationNumbers}>
          {!pages_range.includes(1) && (
            <h5
              onClick={goToPage}
              key={1}
              className={`${styles.paginationButton}`}
            >
              1
            </h5>
          )}

          {pages_range.map((page, index) => {
            return (
              <h5
                onClick={goToPage}
                key={page}
                className={`${styles.paginationNumber} ${
                  currentPage == page && styles.selectedPageNumber
                }`}
              >
                {page}
              </h5>
            );
          })}

          {!pages_range.includes(pagesCount) && (
            <h5
              onClick={goToPage}
              key={pagesCount}
              className={`${styles.paginationButton}`}
            >
              {pagesCount}
            </h5>
          )}
        </div>

        <h3
          className={`${styles.paginationButton} ${
            currentPage == pagesCount && styles.invisibleButton
          }`}
          onClick={goToNextPage}
        >
          Próxima
        </h3>
      </div>
    </div>
  );
}
