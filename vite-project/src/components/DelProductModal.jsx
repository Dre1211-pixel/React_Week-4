import { useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'; // 引入 Bootstrap Modal

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "test886";

function DelProductModal({ getProducts, isOpen, setIsOpen, tempProduct}) {
    
    const delProductModalRef = useRef(null); //  用 useRef 去抓取刪除產品 Modal 的 DOM 元素

    useEffect(() => {
        delProductModalRef.current = new Modal('#delProductModal', {
            backdrop: false
        });

        // Get products with initial page 1
        getProducts(1);
    }, []);

    // 宣告 handleCloseDelProductModal 函式，用來「CLOSE」刪除產品 Modal，記得綁定到刪除產品的按鈕上！
    const handleCloseDelProductModal = () => {
        delProductModalRef.current.hide(); // 開啟刪除產品 Modal
    }

    // 刪除產品
    const handleDelProduct = async () => {
        try {
        await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`);
        getProducts();
        handleCloseDelProductModal();
        } catch (error) {
            alert('刪除產品失敗:' + error.response.data.message);
        }
    }
    
    return (
        <>
            {/* 刪除產品 Modal */}
            <div
                ref={delProductModalRef}
                className="modal fade"
                id="delProductModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除產品</h1>
                    <button
                        onClick={handleCloseDelProductModal}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除
                    <span className="text-danger fw-bold">{tempProduct?.title || '此產品'}</span>
                    </div>
                    <div className="modal-footer">
                    <button
                        onClick={handleCloseDelProductModal}
                        type="button"
                        className="btn btn-secondary"
                    >
                        取消
                    </button>
                    <button onClick={handleDelProduct} type="button" className="btn btn-danger">
                        刪除
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}
export default DelProductModal;
