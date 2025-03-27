export async function fetchAudits() {
  const response = await fetch(
    window?.location?.href.includes("localhost")
      ? `http://localhost:3000/api/audits`
      : `https://api.fastcash-mx.com/api/audits`,
  );
  return response.json();
}

export async function fetchAuditById(id) {
  try {
    const url = window?.location?.href.includes("localhost")
      ? `http://localhost:3000/api/audits/${id}`
      : `https://api.fastcash-mx.com/api/audits/${id}`;

      console.log("url api: ", url);
      
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error("Error al obtener la información del audit por Id:", error);
    return {};
  }
}
