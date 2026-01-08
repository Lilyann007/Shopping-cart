import React,{ useState,useEffect } from "react";
import './App.css';

export default function CartApp(){
  
  //状态声明区
  const [products,setProducts] = useState([
    {id: 1, name: 'iPhone 15', price: 7999, icon: '📱'},
    {id: 2, name: 'AirPods Pro', price: 1999, icon: '🎧'},
    {id: 3, name: 'MacBook Air', price: 9999, icon: '💻'},
    {id: 4, name: 'Apple Watch', price: 2999, icon: '⌚'},
    {id: 5, name: 'iPad Pro', price: 6999, icon: '📱'},
    {id: 6, name: 'Magic Mouse', price: 799, icon: '🖱️'},
  ]);

  const [cart,setCart] = useState(() => {
    try {
      const saved =localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  
  useEffect(() => {
    localStorage.setItem("cart",JSON.stringify(cart));
  },[cart]);
  
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);


  //逻辑计算区（变量声明）
  const checkedItem = cart.filter((item) => item.checked === true);


  //事件处理区
  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if(exists){
      setCart(cart.map((item => 
        item.id === product.id
        ? {...item,quantity:item.quantity+1}
        : item
      )))
    }else{
      setCart([...cart,{...product,quantity:1,checked:false}])
    }
  }

  const handleDecrease = (id) => {
    setCart(cart.map((item) =>
      item.id === id
      ? {...item,quantity:item.quantity-1}
      : item
    ))
  }

  const handleIncrease = (id) => {
    setCart(cart.map((item) =>
      item.id === id
      ? {...item,quantity:item.quantity+1}
      : item
    ))
  }

  const handleDelete = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const handleChecked = (id) => {
    setCart(cart.map((item) =>
      item.id === id
      ? {...item,checked:!item.checked}
      : item
    ))
  }

  //全选为button情况⬇️
  // const handleSelectAll = () => {
  //   // 🚩 旗帜：现在的购物车是“已经全选了”吗？
  //   // 如果每一个(every) item 的 checked 都是 true，那 isAllChecked 就是 true
  //   const isAllChecked = cart.length > 0 && cart.every(item => item.checked)
  //   const targetValue = !isAllChecked;
  //   setCart(cart.map((item) => (
  //     {...item,checked:targetValue}  // 👈 所有人统一使用这个动态算出来的目标值
  //     )  
  //   ))
  // }


  //全选为input情况⬇️
  const handleSelectAll = (e) => {
    // e.target.checked 代表了用户点击这个勾选框后，它“应该”呈现的状态
    setCart(cart.map((item) => ({...item,checked:e.target.checked})))
  }


  const handleBatchDeletion = () => {
    setCart(cart.filter(item => !item.checked));
  }

  //渲染区
  return(
    <div className="container">
      <div className="header"><h1>🛒购物车系统</h1></div>

      <div className="products">
        <div className="products-title"><h2>商品列表</h2></div>
        {products.map((product) => (
          <div className="product" key={product.id}>
            <div className="product-icon">{product.icon}</div>
            <div className="product-info">
              <div>{product.name}</div>
              <div>¥{product.price}</div>
            </div>
            <button 
              className="addToCart-btn" 
              onClick={() => handleAddToCart(product)}>
                加入购物车
            </button>
          </div>
        ))}
      </div>

      <div className="cart">
        <div className="cart-header">
          <h2>购物车（{cart.length}）</h2>
          <label>
            <input type="checkbox" onChange={(e) => handleSelectAll(e)}/>
            全选
          </label>
          
        </div>
        
        {cart.map((item) => (
          <div className="item" key={item.id}>
            <input 
              type="checkbox" 
              checked={item.checked} 
              onChange={() => handleChecked(item.id)}>
            </input>
            <div>{item.icon}{item.name}</div>
            <div>{item.price}</div>
            
            <button 
              disabled={item.quantity <= 1} 
              onClick={() => handleDecrease(item.id)}>
                -
            </button>
            <div>{item.quantity}</div>
            <button onClick={() => handleIncrease(item.id)}>+</button>
            <button onClick={() => handleDelete(item.id)}>🙂‍↔️删除</button>
            
            <div className="item-sum">小计：¥{item.price * item.quantity}</div>
          </div>
        ))}

        {checkedItem.length !== 0 && (
          <button onClick={handleBatchDeletion}>删除所选（{checkedItem.length}）</button>
        )}
        
        <div className="sum">
          <div>总计：</div>
          <div>{cart.reduce((sum,item) => {
                  return sum + (item.price * item.quantity);
                },0)}
          </div>
          <div>已选（{checkedItem.length}件）：</div>
          <div>{checkedItem.reduce((sum,item) => {
            return sum + (item.quantity * item.price)
          },0)}</div>
          <button>结算（{cart.length}件）</button>
        </div>
      </div>
    </div>
  )
}