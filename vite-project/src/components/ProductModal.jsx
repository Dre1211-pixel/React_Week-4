import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'; // 引入 Bootstrap Modal

x

function ProductModal({ modalMode, tempProduct, isOpen, setIsOpen, getProducts }) {
    // Initialize modalData with default values
    const [modalData, setModalData] = useState({
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
    });

    const productModalRef = useRef(null);
    
    // Initialize Bootstrap modal
    useEffect(() => {
        productModalRef.current = new Modal('#productModal', {
            backdrop: 'static',
            keyboard: false
        });

        // Cleanup function to destroy modal when component unmounts
        return () => {
            if (productModalRef.current) {
                productModalRef.current.dispose();
            }
        };
    }, []);

    // Handle modal visibility
    useEffect(() => {
        if (isOpen && productModalRef.current) {
            productModalRef.current.show();
        } else if (!isOpen && productModalRef.current) {
            productModalRef.current.hide();
        }
    }, [isOpen]);

    // Update modalData when tempProduct changes
    useEffect(() => {
        if (tempProduct) {
            setModalData(tempProduct);
        } else {
            // Reset to default values when tempProduct is null
            setModalData({
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
            });
        }
    }, [tempProduct]);

    // Handle modal close
    const handleCloseProductModal = () => {
        setIsOpen(false);
        setModalData({
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
        });
    }

    // Add event listeners for modal events
    useEffect(() => {
        const modalElement = document.getElementById('productModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', () => {
                setIsOpen(false);
            });
        }
    }, [setIsOpen]);

    // 通過 handleModalInputChange 更新產品 Modal 的狀態，設定完狀態就要去 return 的 html 結構中綁定對應的 dom 元素
    const handleModalInputChange = (e) => {
        const { name, value, checked, type } = e.target; // name 是 input 元素的 name 屬性值，value 是 input 元素的 value 屬性值，checked 是 checkbox 元素的 checked 屬性值，type 是 input 元素的 type 屬性值(增加 type 是為了判斷是否為 checkbox)
        setModalData({
        ...modalData, // 展開原先的 modalData
        [name]: type === "checkbox" ? checked : value // 通過 name 屬性來更新對應的值；如果 name 是 checkbox 就用 checked ,否則就用 value 
        });
    }

    // 通過 handleImageChange 讓用戶可以編輯更新副圖的網址連結
    const handleImageChange = (e, index) => {
        const { value } = e.target; // value 是要上傳圖片的網址
        const newImages = [...modalData.imagesUrl]; // 將副圖的網址傳入到一個新的陣列中
        newImages[index] = value; // 將上傳圖片的網址傳入到新的陣列中；傳入 index 參數是為了將上傳圖片的網址傳入到對應的副圖的位置，[0] 代表第一張副圖，[1] 代表第二張副圖，以此類推
        setModalData({
        ...modalData, // 展開原先的 modalData
        imagesUrl: newImages // 將上傳圖片的網址傳入到 modalData 副圖的 imagesUrl 屬性
        })
    }

    // 通過 handleAddImage 讓用戶可以新增副圖
    const handleAddImage = () => {
        const newImages = [...modalData.imagesUrl, ''];

        setModalData({ // 將副圖的網址傳入到一個新的陣列中
        ...modalData, // 展開原先的 modalData
        imagesUrl: newImages // 將副圖的網址傳入到 modalData 副圖的 imagesUrl 屬性
        })
    }

    // 通過 handleRemoveImage 讓用戶可以刪除副圖
    const handleRemoveImage = (index) => {
        const newImages = [...modalData.imagesUrl];

        // 刪除副圖（常見刪除資料的方法有兩種：splice() 和 pop()）
        // newImages.splice(index, 1); // splice() 可以移除指定位置、指定數量的陣列值
        newImages.pop(); // pop() 則是移除最後一個陣列值，因為 modal 只能刪除最後一個副圖，所以這邊使用 pop()

        setModalData({ // 將副圖的網址傳入到一個新的陣列中
        ...modalData, // 展開原先的 modalData
        imagesUrl: newImages // 將副圖的網址傳入到 modalData 副圖的 imagesUrl 屬性
        })
    }

    // 通過 createProduct 新增產品
    const createProduct = async () => {
        try {
        await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, {
            data: {
            ...modalData,
            origin_price: Number(modalData.origin_price), // 將「原價」和「售價」用 Number() 將原本 API 資料集中的字串轉換成數字
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0 // 
            }

        });
        } catch (error) {
        alert('新增產品失敗:' + error.response.data.message);
        }
    }

    // 通過 updateProduct 編輯產品
    const updateProduct = async () => {

        try {
        // 編輯產品的 axios 指令改成 push (常見的 5 種 axios 指令如下，請牢記：post、get、put、delete，patch 分別代表「新增」、「讀取」、「編輯」、「刪除」、「部分更新」，詳情請參考：https://ihower.tw/blog/archives/6483)
        await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`, {
            data: {
            ...modalData,
            origin_price: Number(modalData.origin_price), // 將「原價」和「售價」用 Number() 將原本 API 資料集中的字串轉換成數字
            price: Number(modalData.price), // 同上
            is_enabled: modalData.is_enabled ? 1 : 0  // 1 代表啟用，0 代表未啟用
            }

        });
        } catch (error) {
        alert('編輯產品失敗:' + error.response.data.message);
        }
    }

    // 添加：宣告一個 handleUpdateProduct 的函式將「新增」or「編輯」後通過點擊 modal 的「確認」按鈕觸發 re-render，將「新增」or「編輯」後的資料渲染到網頁上
    const handleUpdateProduct = async () => {
        const apiCall = modalMode === 'create' ? createProduct : updateProduct;

        try {
            await apiCall();
            await getProducts();
            setIsOpen(false); // Use setIsOpen instead of directly manipulating the modal
            handleCloseProductModal(); // This will reset the form
        } catch (error) {
            alert('更新產品失敗:' + error.response?.data?.message || error.message);
        }
    }

    const handleFileChange = async(e) => {
        // console.log(e.target);
        
        const file = e.target.files[0]; 
        
        const formData = new FormData(); // 宣告一個新的 FormData 用來存取我們上傳的照片
        formData.append('file-to-upload', file) // 將上傳的照片加入到 FormData 中；file-to-upload 是我們在後端定義上傳照片的欄位名稱
        
        // console.log(formData); // 用 console.log 檢視一下上傳的照片是否成功加入到 FormData 中
        
        try {
        const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData) 
        
        const uploadedImageUrl = res.data.imageUrl;
        
        setModalData({ 
            ...modalData,
            imageUrl: uploadedImageUrl
        })
        
        } catch (error) {
        
        }

    }

    
    return (
        <>
            {/*  產品 Modal */}
            <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}> 
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header border-bottom">
                            <h5 className="modal-title fs-4">{modalMode === "create" ? "新增產品" : "編輯產品"}</h5> {/* 通過傳入 modalMode 的狀態參數 (create 或 edit) 來決定 Modal 是判斷 modal 的標題是顯示「新增產品」還是「編輯產品」*/}
                            <button onClick={handleCloseProductModal} type="button" className="btn-close" aria-label="Close"></button> {/* 通過 onClick 事件觸發 handleCloseModal 讓用戶可以通過點擊 modal（彈跳視窗) 的「x」關閉產品 Modal */}
                        </div>

                        <div className="modal-body p-4">
                        <div className="row g-4">
                            <div className="col-md-4">
                            <div className="mb-4">
                                <div className="mb-5">
                                <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className="form-control"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                />
                                </div>
                                <label htmlFor="primary-image" className="form-label">
                                    主圖
                                </label>
                                <div className="input-group">
                                <input
                                    value={modalData.imageUrl || ""} // 設定產品的圖片連結
                                    onChange={handleModalInputChange} // 通過 onChange 事件來更新圖片連結
                                    name="imageUrl"
                                    type="text"
                                    id="primary-image"
                                    className="form-control"
                                    placeholder="請輸入圖片連結"
                                />
                                </div>
                                <img
                                src={modalData.imageUrl || null} // 將圖片的 src 屬性設定為產品的圖片連結； 如果圖片連結為空,則設定為 null，不然畫面上會出現空的圖片（basically 一個顯示 
                                alt={modalData.title} // 將圖片的 alt 屬性設定為產品的標題
                                className="img-fluid"
                                />
                            </div>

                            {/* 副圖 */} {/* 副圖先不用設定！等設定完「新增產品」&「編輯產品」功能後再來設定 */}
                            <div className="border border-2 border-dashed rounded-3 p-3">
                                {modalData.imagesUrl?.map((image, index) => (
                                <div key={index} className="mb-2">
                                    <label
                                    htmlFor={`imagesUrl-${index + 1}`}
                                    className="form-label"
                                    >
                                    副圖 {index + 1}
                                    </label>
                                    <input
                                        value={image} // 將副圖的值設定為產品的副圖
                                        onChange={(e) => handleImageChange(e, index)} // 通過 onChange 事件來更新副圖的值，e 代表事件物件, index 代表副圖的索引 
                                        id={`imagesUrl-${index + 1}`}
                                        type="text"
                                        placeholder={`圖片網址 ${index + 1}`}
                                        className="form-control mb-2"
                                    />
                                    {image && (
                                    <img
                                        src={image}
                                        alt={`副圖 ${index + 1}`}
                                        className="img-fluid mb-2"
                                    />
                                    )}
                                </div>
                                ))}

                                <div className="btn-group w-100">
                                {/* 通過條件判斷來決定是否顯示新增圖片的按鈕：如果圖片數量小於 5 且「圖片網址」不是空值（空字串），就顯示新增圖片的按鈕 / 如果圖片數量已有 5 張或「圖片網址」是空值（空字串），就不顯示新增圖片的按鈕 */}
                                {modalData.imagesUrl.length < 5 &&
                                    modalData.imagesUrl[modalData.imagesUrl.length - 1] !== '' &&
                                    (<button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>)}

                                {modalData.imagesUrl.length > 1 &&
                                    (<button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>)}
                                </div>

                            </div>
                            </div>

                            <div className="col-md-8">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                標題
                                </label>
                                <input
                                    value={modalData.title} // 將標題的值設定為產品的標題
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="title"
                                    id="title"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入標題"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">
                                分類
                                </label>
                                <input
                                    value-={modalData.category} // 將分類的值設定為產品的分類
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="category"
                                    id="category"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入分類"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="unit" className="form-label">
                                單位
                                </label>
                                <input
                                value={modalData.unit} // 將單位的值設定為產品的單位
                                onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                name="unit"
                                id="unit"
                                type="text"
                                className="form-control"
                                placeholder="請輸入單位"
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                <label htmlFor="origin_price" className="form-label">
                                    原價
                                </label>
                                <input
                                    value={modalData.origin_price} // 將原價的值設定為產品的原價
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="origin_price"
                                    id="origin_price"
                                    type="number"
                                    className="form-control"
                                    placeholder="請輸入原價"
                                />
                                </div>
                                <div className="col-6">
                                <label htmlFor="price" className="form-label">
                                    售價
                                </label>
                                <input
                                    value={modalData.price} // 將售價的值設定為產品的售價
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="price"
                                    id="price"
                                    type="number"
                                    className="form-control"
                                    placeholder="請輸入售價"
                                />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                產品描述
                                </label>
                                <textarea
                                    value={modalData.description} // 將產品描述的值設定為產品的產品描述
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    rows={4}
                                    placeholder="請輸入產品描述"
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">
                                說明內容
                                </label>
                                <textarea
                                    value={modalData.content} // 將說明內容的值設定為產品的說明內容
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="content"
                                    id="content"
                                    className="form-control"
                                    rows={4}
                                    placeholder="請輸入說明內容"
                                ></textarea>
                            </div>

                            <div className="form-check">
                                <input
                                    checked={modalData.is_enabled} // 將是否啟用的值設定為產品的是否啟用；；但是，這邊注意，handleInputChange 無法直接更新 is_enabled 的值，因為它是一個 boolean 值（true 或 false），所以要用 checked prop (屬性) 來更新，所以這邊不能用 value 屬性而使用 checked 屬性，同時也要在 handleModalInputChange 中加上 checked 屬性！
                                    onChange={handleModalInputChange} // 通過 handleModalInputChange 更新產品 Modal 的狀態
                                    name="is_enabled"
                                    type="checkbox"
                                    className="form-check-input"
                                    id="isEnabled"
                                />
                                <label className="form-check-label" htmlFor="isEnabled">
                                是否啟用
                                </label>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="modal-footer border-top bg-light">
                        <button onClick={handleCloseProductModal} type="button" className="btn btn-secondary"> {/* 宣告 handleCloseProductModal 函式，用來關閉「關閉 產品Modal」 */}
                            取消
                        </button>
                        <button onClick={handleUpdateProduct} type="button" className="btn btn-primary"> {/* 宣告 handleUpdateProduct 函式，用來更新「新增/編輯/刪除 產品Modal」 */}
                            確認
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductModal