import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'; // 引入 Bootstrap Modal
import Pagination from '../components/Pagination'; // 引入分頁元件
import ProductModal from '../components/ProductModal'; // 引入產品 Modal 元件

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "test886";

// 宣告一個預設的 Modal 狀態
const defaultModalState = {
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};

function ProductPage({ setIsAuth }) {
    
    const [products, setProducts] = useState([]);

    const [tempProduct, setTempProduct] = useState(null); // Add this line to define tempProduct

    const delProductModalRef = useRef(null); //  用 useRef 去抓取刪除產品 Modal 的 DOM 元素

    const [pageInfo, setPageInfo] = useState({}) // 用來儲存分頁資料

    const [modalMode, setModalMode] = useState(null); // 為了讓我們可以判斷是新增產品還是編輯產品，我們需要宣告一個 modalMode 的狀態

    const[isProductModalOpen, setIsProductModalOpen] = useState(false); // 用來判斷產品 Modal 是否開啟

    const[isDelProductModalOpen, setIsDelProductModalOpen] = useState(false); // 用來判斷刪除產品 Modal 是否開啟
    
    const getProducts = async (page = 1) => {
        try {
            const response = await axios.get(
                `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
            );
            // console.log('API Response:', response.data); // Debug log
            
            if (response.data.success) {
                setProducts(response.data.products);
                setPageInfo({
                    total_pages: response.data.pagination.total_pages,
                    current_page: response.data.pagination.current_page,
                    has_pre: response.data.pagination.has_pre,
                    has_next: response.data.pagination.has_next,
                    category: response.data.pagination.category
                });
            } else {
                // console.error('API request was not successful:', response.data);
            }
        } catch (error) {
            // console.error('Error fetching products:', error);
            alert('取得產品列表失敗：' + (error.response?.data?.message || error.message));
        }
    };


    useEffect(() => {
        // console.log("call useEffect:", modalMode);
    }, [modalMode]);

    const handlePageChange = async(page) => {
        getProducts(page)
    }

    // 宣告 handleOpenModal 函式，用來「OPEN」產品 Modal
    const handleOpenProductModal = (mode, product) => {
        setModalMode(mode);
        // If mode is 'create', pass defaultModalState, otherwise pass the product
        setTempProduct(mode === 'create' ? defaultModalState : product);
        setIsProductModalOpen(true);
    }

    // 宣告 handleOpenDelProductModal 函式，用來「OPEN」刪除產品 Modal
    const handleOpenDelProductModal = (product) => {
        setTempProduct(product);
        delProductModalRef.current.show();
    }


    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    <div className="col">
                    <div className="d-flex justify-content-between">
                        <h2>即將上映</h2>
                        <button onClick={() => handleOpenProductModal('create')} type="button" className="btn btn-primary">建立新的產品</button> {/* 通過 onClick 事件觸發 handleOpenModal，並傳入 "create" 這個參數，因為我們這邊是要新增產品 */}
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">產品名稱</th>
                            <th scope="col">原價</th>
                            <th scope="col">售價</th>
                            <th scope="col">是否啟用</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                            <th scope="row">{product.title}</th>
                            <td>{product.origin_price}</td>
                            <td>{product.price}</td>
                            <td>{product.is_enabled ? (<span className="text-success">已啟用</span>) : <span className="text-danger">未啟用</span>}</td>
                            <td>
                                <div className="btn-group">
                                <button onClick={() => handleOpenProductModal('edit', product)} type="button" className="btn btn-outline-primary btn-sm">編輯</button> {/* 通過 onClick 事件觸發 handleOpenModal，並傳入 "edit" 這個參數，因為我們這邊是要新增產品 */}
                                <button onClick={() => handleOpenDelProductModal(product)} type="button" className="btn btn-outline-danger btn-sm">刪除</button> {/* 通過 onClick 事件觸發 handleOpenDelModal */}
                                </div>
                            </td>
                            <td>
                                <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const updatedProducts = products.map((p) =>
                                    p.id === product.id
                                        ? { ...p, is_enabled: !p.is_enabled }
                                        : p
                                    );
                                    setProducts(updatedProducts);
                                }}
                                >
                                轉換啟用狀態
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                {/* Only render pagination if we have pageInfo and total_pages > 0 */}
                {pageInfo && pageInfo.total_pages > 0 && (
                    <Pagination 
                        pageInfo={pageInfo} 
                        handlePageChange={handlePageChange}
                    />
                )}
            </div>
            
            <ProductModal 
                tempProduct={tempProduct} 
                modalMode={modalMode} 
                isOpen={isProductModalOpen} 
                setIsOpen={setIsProductModalOpen}
                getProducts={getProducts}
            />

            <DelProductModal
                isOpen={isDelProductModalOpen}
                setIsOpen={setIsDelProductModalOpen}
                getProducts={getProducts}
                tempProduct={tempProduct}
            />

        </>
    )
}

export default ProductPage;