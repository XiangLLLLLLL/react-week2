import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL;

// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //登入功能
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, account);
      const { token, expired } = response.data;
      document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;
      setIsAuth(true);
      axios.defaults.headers.common["Authorization"] = token;
      getData();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 登入驗證功能
  const checkLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/api/user/check`);
      alert("使用者已登入");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 取input的值到account
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  // 更換其他圖片到主圖
  function changeImageUrl(e) {
    setMainImage(e.target.currentSrc);
  }

  // 查看其他資料時，將主圖的網址重新帶入
  function changeProducts(item) {
    setProduct(item);
    setMainImage(item.imageUrl);
  }

  return (
    <>
      {isAuth ? (
        <div className="container mt-5">
          <div className="row row-cols-2">
            <div className="col">
              <button type="button" className="btn btn-secondary mb-3" onClick={checkLogin}>
                驗證登入
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row">{item.title}</th>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            changeProducts(item);
                          }}
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col">
              <h2>單一產品細節</h2>
              {product ? (
                <div className="card" key={product.id}>
                  <img src={mainImage || product.imageUrl} className="card-img-top object-fit-cover" style={{ height: "350px" }} alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">
                      {product.title} <span className="badge bg-primary">{product.category}</span>
                    </h5>
                    <p className="card-text">商品描述:{product.description}</p>
                    <p className="card-text">商品內容:{product.content}</p>
                    <p className="card-text">
                      <del>{product.origin_price}元</del> / {product.price}元
                    </p>
                    <h5 className="card-text">更多圖片:</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <div className="">
                        <img src={product.imageUrl} onClick={changeImageUrl} className="object-fit-cover" style={{ height: "140px", width: "140px" }} />
                      </div>
                      {product.imagesUrl.map((item, index) =>
                        item ? (
                          <div className="" key={index}>
                            <img src={item} onClick={changeImageUrl} className="object-fit-cover" style={{ height: "140px", width: "140px" }} />
                          </div>
                        ) : (
                          <div className="" key={index}></div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <h5> 請選擇一個商品查看 </h5>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleLogin}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="username" name="username" placeholder="name@example.com" value={account.username} onChange={handleInputChange} required autoFocus />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={account.passward} onChange={handleInputChange} required />
                  <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-lg btn-primary w-100 mt-3">登入</button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
