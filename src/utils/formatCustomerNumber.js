export function formatNumber(whatsappNumber) {
  const cleanNumber = whatsappNumber.replace(/^whatsapp:/, "");
  const numericOnly = cleanNumber.replace(/\D/g, "");

  if (numericOnly[2] === "9") {
    return numericOnly.slice(0, 2) + numericOnly.slice(3);
  }

  return numericOnly;
}
