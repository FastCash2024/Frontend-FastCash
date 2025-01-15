import React, { useEffect, useState } from "react";

export const Paginator = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange, onReload }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [goToPage, setGoToPage] = useState(currentPage);

  useEffect(() => {
    setGoToPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (!isNaN(pageNumber)) {
      handlePageChange(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event) => {
    onItemsPerPageChange(parseInt(event.target.value, 10));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 ${currentPage === i ? 'bg-blue-500 text-white border border-gray-300 rounded-sm' : 'bg-white border border-gray-300 hover:bg-gray-100 text-black'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      pageNumbers.push(
        <button
          key={1}
          className={`px-3 py-1 ${currentPage === 1 ? 'bg-blue-500 text-bla border border-gray-300 rounded-sm' : 'bg-white border border-gray-300 hover:bg-gray-100 text-black'}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (currentPage > 3) {
        pageNumbers.push(<span key="start-ellipsis" className="px-1">...</span>);
      }
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 ${currentPage === i ? 'bg-blue-500 text-white border border-gray-300 rounded-sm' : 'bg-white border border-gray-300 hover:bg-gray-100 text-black'}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push(<span key="end-ellipsis" className="px-1 text-black">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className={`px-3 py-1 ${currentPage === totalPages ? 'bg-blue-500 text-white border border-gray-300 rounded-sm' : 'bg-white border border-gray-300 hover:bg-gray-100 text-black'}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center space-x-4 text-sm justify-end">
      <div className="flex items-center space-x-1">
        <span className="text-[#555]">Total</span>
        <span className="text-black">{totalItems}</span>
      </div>

      <div className="flex items-center">
        <button 
          className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-black"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {renderPageNumbers()}

        <button 
          className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-black"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <button 
        className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-black"
        onClick={onReload}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>

      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Go to</span>
        <input
          type="text"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          className="w-12 h-7 px-2 text-center border border-gray-300 rounded text-black"
        />
      </div>

      <button 
        onClick={handleGoToPage}
        className="px-4 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-300 text-gray-700"
      >
        Confirm
      </button>

      <div className="flex items-center space-x-2">
        <span className="text-gray-500">Items per page</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="w-20 h-7 px-2 text-center border border-gray-300 rounded  text-black"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size} className="text-black">
              {size}/page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};