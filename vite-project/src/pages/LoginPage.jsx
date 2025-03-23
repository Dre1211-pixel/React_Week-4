import { useState } from 'react'
import axios from 'axios'

const API_BASE = "https://ec-course-api.hexschool.io/v2";

function LoginPage({ setIsAuth }) {

    const [account, setAccount] = useState({
        "username": "example@test.com",
        "password": "example"
    })

    const handleInputChange = (e) => {
        const { value, name } = e.target;
        setAccount({
            ...account,
            [name]: value
        })
        // console.log(account); // 用 console.log 來檢視一下 使用者資料是否有存入 account 中
    }
    
    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${API_BASE}/admin/signin`, account);
            const { token, expired } = response.data;
            document.cookie = `AwesomeToken=${token}; expires=${new Date(expired)}`;

            axios.defaults.headers.common['Authorization'] = token;

            // getProducts();

            setIsAuth(true);
        } catch (error) {
            alert("登入失敗：" + error.response.data.message);
        }
    };

    // const checkUserLogin = () => {
    //     axios.post(`${API_BASE}/api/user/check`)
    //         .then((response) => {
    //         setIsAuth(true) // 因為我們把檢查用戶是否已經登陸的按鈕刪除了，所以改用 setIsAuth(true) 來判斷用戶是否已經登陸
    //         getProducts(); // 若用戶已經登陸，則執行 getProducts() 來抓取產品資料
    //     })
    //         .catch((error) => console.error(error)
    //     )
    // }
    
    // // 通過 useEffect 在登錄頁面渲染的時候去呼叫 checkUserLogin 進而抓取產品資料
    // useEffect(() => {
    //     // Step 1: 如果我們上面有把 token 存到 cookie 裡的話，就可以用下面的方式來抓取 token，token 中含有用戶的登陸資訊 (帳號 & 密碼），token 的名稱我們前面設定為 AwesomeToken)
    //     const token = document.cookie.replace(
    //         /(?:(?:^|.*;\s*)AwesomeToken\s*\=\s*([^;]*).*$)|^.*$/,
    //         "$1",
    //     );
    
    //     axios.defaults.headers.common['Authorization'] = token; // Step 2: 把 token 存到 axios 的 headers 裡
    
    //     checkUserLogin(); // Step 3: 呼叫 checkUserLogin
    
    //     productModalRef.current = new Modal("#productModal", { 
    //         keyboard: false,
    //         backdrop: false
    //     });
    
    //     delProductModalRef.current = new Modal("#delProductModal", {
    //         keyboard: false,
    //         backdrop: false
    //     })
    // }, []) // Step 4: 記得附上一個空陣列 []；Alternatively, 陣列裡面可以寫入 useEffect 的依賴變數，也就是代表 useEffect 會在這個依賴變數改變的時候被觸發。如果我們留一個空陣列 [],就是代表 useEffect 會在整個網頁首次渲染的時候被觸發一次後就停止！
    
    
    return (
        (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className="mb-5">請先登入</h1>
            <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
                <div className="form-floating mb-3">
                    <input onChange={handleInputChange} 
                        name="username" value={account.username} 
                        type="email" 
                        className="form-control" 
                        id="username" 
                        placeholder="name@example.com" 
                    />
                    <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                    <input 
                        onChange={handleInputChange} 
                        name="password" 
                        value={account.password}
                        type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password" 
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-primary">登入</button>
            </form>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>)
    )
}

export default LoginPage;
