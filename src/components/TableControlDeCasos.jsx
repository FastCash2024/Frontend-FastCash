import React from 'react'

export default function TableControlDeCasos() {

    async function handlerFetchVerification(limit, page) {
        const urlParams = new URLSearchParams(window.location.search);

        const filterParams = {};

        urlParams.forEach((value, key) => {
            if (key.startsWith("filter[") && value !== "Elije por favor" && value !== "Todo") {
                const fieldName = key.slice(7, -1);
                filterParams[fieldName] = value;
            }
        });

        const queryString = Object.keys(filterParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`)
            .join("&");

        // console.log("querys: ", urlParams);
        const baseUrl = window?.location?.href?.includes("localhost")
            ? `http://localhost:3000/api/verification?estadoDeCredito=Dispersado,Pagado`
            : `https://api.fastcash-mx.com/api/verification?estadoDeCredito=Dispersado,Pagado`;

        const finalURL = queryString ? `${baseUrl}&${queryString}` : baseUrl;
        console.log("url local solicitada: ", finalURL);
        try {
            const res = await fetch(finalURL);
            const result = await res.json();

            setCases(result.data);
            setCurrentPage(result.currentPage);
            setTotalPages(result.totalPages);
            setTotalDocuments(result.totalDocuments);
        } catch (error) {
            console.error("Error al obtener datos: ", error)
            setLoader(false);
        }
        // const result = await res.json();
        // console.log(data)
    }
    return (
        <div>TableControlDeCasos</div>
    )
}
