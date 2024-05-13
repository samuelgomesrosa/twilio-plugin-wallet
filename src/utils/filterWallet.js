export function filterWalletItem(item, searchTerm, selectedFilter) {
  const searchString = searchTerm.toLowerCase();

  switch (selectedFilter) {
    case "nrCliente":
      return String(item.nrCliente).toLowerCase().includes(searchString);
    case "cgcCpfCliente":
      return String(item.cgcCpfCliente).toLowerCase().includes(searchString);
    case "cdAgrupamentoCliente":
      return String(item.cdAgrupamentoCliente)
        .toLowerCase()
        .includes(searchString);
    case "nmCliente":
      return String(item.nmCliente).toLowerCase().includes(searchString);
    case "cidadeEstado":
      return (
        String(item.cidade).toLowerCase().includes(searchString) ||
        String(item.estado).toLowerCase().includes(searchString)
      );
    default:
      return (
        String(item.nrCliente).toLowerCase().includes(searchString) ||
        String(item.cgcCpfCliente).toLowerCase().includes(searchString) ||
        String(item.cdAgrupamentoCliente)
          .toLowerCase()
          .includes(searchString) ||
        String(item.nmCliente).toLowerCase().includes(searchString) ||
        String(item.cidade).toLowerCase().includes(searchString) ||
        String(item.estado).toLowerCase().includes(searchString)
      );
  }
}
