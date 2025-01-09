import React, { useState } from "react";

export const Paginator = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  onReload,
}) => {
  const [inputPage, setInputPage] = useState("");

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleInputPageChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputPageSubmit = () => {
    const pageNumber = Number(inputPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pageNumbers;
  };
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-white">Total registros: {totalItems}</div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          ←
        </button>
        {renderPageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === "number" && onPageChange(number)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            disabled={typeof number !== "number"}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          →
        </button>
        <button onClick={onReload} className="px-2 py-1 bg-gray-300 rounded">
          🔄
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={inputPage}
          onChange={handleInputPageChange}
          className="w-12 px-2 py-1 border rounded"
          placeholder="Page"
        />
        <button
          onClick={handleInputPageSubmit}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          Confirm
        </button>
      </div>
      <div>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border rounded"
        >
          <option value={10}>10/page</option>
          <option value={100}>100/page</option>
          <option value={200}>200/page</option>
          <option value={300}>300/page</option>
          <option value={400}>400/page</option>
          <option value={500}>500/page</option>
        </select>
      </div>
    </div>
  );
};
