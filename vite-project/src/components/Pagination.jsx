function Pagination({ pageInfo, handlePageChange }) {
    const handleClick = (e, page) => {
        e.preventDefault();
        handlePageChange(page);
    };

    return (
        <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li key="prev" className={`page-item ${!pageInfo.has_pre ? 'disabled' : ''}`}> 
                        <a 
                            onClick={(e) => handleClick(e, pageInfo.current_page - 1)} 
                            className="page-link" 
                            href="#"
                            role="button"
                            aria-label="Previous page"
                        >
                            上一頁
                        </a>
                    </li>

                    {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <li 
                                key={`page-${pageNumber}`}
                                className={`page-item ${pageInfo.current_page === pageNumber ? 'active' : ''}`}
                            >
                                <a 
                                    onClick={(e) => handleClick(e, pageNumber)} 
                                    className="page-link" 
                                    href="#"
                                    role="button"
                                    aria-label={`Page ${pageNumber}`}
                                    aria-current={pageInfo.current_page === pageNumber ? 'page' : undefined}
                                >
                                    {pageNumber}
                                </a>
                            </li>
                        );
                    })}

                    <li key="next" className={`page-item ${!pageInfo.has_next ? 'disabled' : ''}`}>
                        <a 
                            onClick={(e) => handleClick(e, pageInfo.current_page + 1)} 
                            className="page-link" 
                            href="#"
                            role="button"
                            aria-label="Next page"
                        >
                            下一頁
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;