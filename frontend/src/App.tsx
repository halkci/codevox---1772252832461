import { useState, useEffect } from 'react'

interface Dish {
  id: number
  name: string
  icon: string
  price: number
}

interface OrderItem {
  dish: Dish
  weight: number
  subtotal: number
}

interface Order {
  id: number
  orderNo: string
  items: any[]
  total: number
  paymentMethod: string
  status: string
  createdAt: string
}

interface User {
  id: number
  username: string
  name: string
  role: string
  active: boolean
}

function App() {
  const [view, setView] = useState<'login' | 'cashier' | 'orders' | 'users'>('login')
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [currentWeight, setCurrentWeight] = useState(285)
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, avgPrice: 0 })
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [manualWeight, setManualWeight] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

  useEffect(() => {
    if (view !== 'login') {
      fetchDishes()
      fetchStats()
    }
  }, [view])

  useEffect(() => {
    if (view === 'users') {
      fetchUsers()
    }
  }, [view])

  const fetchDishes = async () => {
    try {
      const res = await fetch('/api/dishes')
      const data = await res.json()
      if (data.length > 0) setDishes(data)
    } catch (e) { console.log('Error fetching dishes') }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/orders/stats')
      const data = await res.json()
      setStats(data)
    } catch (e) { console.log('Error fetching stats') }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (e) { console.error('Error fetching orders') }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (e) { console.error('Error fetching users') }
  }

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
        setView('cashier')
        setLoginError('')
      } else {
        setLoginError('用户名或密码错误')
      }
    } catch (e) {
      setLoginError('登录失败')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setView('login')
    setOrderItems([])
  }

  const openWeightModal = (dish: Dish) => {
    setSelectedDish(dish)
    setManualWeight('')
    setShowWeightModal(true)
  }

  const confirmAddDish = () => {
    if (!selectedDish) return
    const weight = manualWeight ? parseInt(manualWeight) : Math.floor(Math.random() * 100) + 50
    if (weight <= 0) return
    const subtotal = (selectedDish.price * weight / 100)
    setOrderItems([...orderItems, { dish: selectedDish, weight, subtotal }])
    setCurrentWeight(prev => prev + weight)
    setShowWeightModal(false)
    setSelectedDish(null)
  }

  const addToOrder = (dish: Dish) => {
    const weight = Math.floor(Math.random() * 100) + 50
    const subtotal = (dish.price * weight / 100)
    setOrderItems([...orderItems, { dish, weight, subtotal }])
    setCurrentWeight(prev => prev + weight)
  }

  const removeItem = (index: number) => {
    const item = orderItems[index]
    setOrderItems(orderItems.filter((_, i) => i !== index))
    setCurrentWeight(prev => prev - item.weight)
  }

  const clearOrder = () => {
    setOrderItems([])
    setCurrentWeight(285)
  }

  const handlePayment = async () => {
    if (!selectedPayment) return
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          total: total.toFixed(2),
          paymentMethod: selectedPayment,
          status: 'paid'
        })
      })
      const data = await res.json()
      setOrderNo(data.orderNo)
      setShowPayModal(false)
      clearOrder()
      fetchStats()
      alert(`订单 ${data.orderNo} 支付成功！`)
    } catch (e) {
      alert('订单创建失败')
    }
  }

  const viewOrders = () => {
    fetchOrders()
    setView('orders')
  }

  const toggleUserActive = async (userId: number, active: boolean) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      })
      fetchUsers()
    } catch (e) {
      alert('操作失败')
    }
  }

  const getPaymentName = (method: string) => {
    switch (method) {
      case 'wechat': return '微信支付'
      case 'alipay': return '支付宝'
      case 'card': return '刷卡'
      case 'face': return '人脸识别'
      default: return method
    }
  }

  if (view === 'login') {
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">🌶️ 张亮麻辣烫</div>
          <div className="login-title">收银系统登录</div>
          <div className="login-form">
            <input
              type="text"
              placeholder="用户名"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="密码"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            {loginError && <div className="login-error">{loginError}</div>}
            <button className="login-btn" onClick={handleLogin}>登录</button>
          </div>
          <div className="login-hint">
            默认账号: zhangliang / 123456
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav>
        <div className="logo">🌶️ <span>张亮麻辣烫</span></div>
        <div className="nav-links">
          <a href="#" className={view === 'cashier' ? 'active' : ''} onClick={() => setView('cashier')}>收银台</a>
          <a href="#" className={view === 'orders' ? 'active' : ''} onClick={viewOrders}>订单管理</a>
          {user?.role === 'admin' && (
            <a href="#" className={view === 'users' ? 'active' : ''} onClick={() => setView('users')}>用户管理</a>
          )}
        </div>
        <div className="nav-user">
          <span>{user?.name}</span>
          <button onClick={handleLogout}>退出</button>
        </div>
      </nav>

      {view === 'cashier' && (
        <main>
          <h1 className="page-title">收银台</h1>
          <div className="dashboard">
            <div className="left-panel">
              <div className="card">
                <div className="card-header">
                  <h3>🍲 当前称重</h3>
                  <span className="badge">电子秤已连接</span>
                </div>
                <div className="card-body">
                  <div className="weight-display">
                    <div className="label">当前重量</div>
                    <div className="value">{currentWeight}<span className="unit">g</span></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h3>🥬 菜品选择</h3></div>
                <div className="card-body">
                  <div className="dish-grid">
                    {dishes.map(dish => (
                      <div key={dish.id} className="dish-item" onClick={() => openWeightModal(dish)}>
                        <div className="icon">{dish.icon}</div>
                        <div className="name">{dish.name}</div>
                        <div className="price">¥{dish.price}/斤</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h3>📊 今日数据</h3></div>
                <div className="card-body">
                  <div className="stats-row">
                    <div className="stat-item">
                      <div className="label">今日订单</div>
                      <div className="value">{stats.totalOrders}</div>
                    </div>
                    <div className="stat-item">
                      <div className="label">销售额</div>
                      <div className="value green">¥{stats.totalSales.toFixed(2)}</div>
                    </div>
                    <div className="stat-item">
                      <div className="label">客单价</div>
                      <div className="value">¥{stats.avgPrice.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="right-panel">
              <div className="card current-order">
                <div className="card-header">
                  <h3>🧾 当前订单</h3>
                  <span style={{color: '#71767b', fontSize: '13px'}}>NO.{orderNo || Date.now().toString().slice(-8)}</span>
                </div>
                <div className="card-body">
                  <div className="order-list">
                    {orderItems.length === 0 ? (
                      <div style={{textAlign: 'center', padding: '40px', color: '#71767b'}}>点击左侧菜品添加</div>
                    ) : (
                      orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="dish-info">
                            <span className="emoji">{item.dish.icon}</span>
                            <div className="detail">
                              <div className="name">{item.dish.name}</div>
                              <div className="weight">{item.weight}g × ¥{item.dish.price}</div>
                            </div>
                          </div>
                          <div className="price">¥{item.subtotal.toFixed(2)}</div>
                          <span className="remove-btn" onClick={() => removeItem(index)}>✕</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body summary-card">
                  <div className="total-label">订单合计</div>
                  <div className="total-amount">¥<span>{total.toFixed(2)}</span></div>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h3>💳 支付方式</h3></div>
                <div className="card-body">
                  <div className="payment-methods">
                    <div className="pay-btn" onClick={() => { setSelectedPayment('wechat'); setShowPayModal(true); }}><div className="icon">💚</div><div className="name">微信支付</div><div className="desc">扫码付</div></div>
                    <div className="pay-btn" onClick={() => { setSelectedPayment('alipay'); setShowPayModal(true); }}><div className="icon">💙</div><div className="name">支付宝</div><div className="desc">扫码付</div></div>
                    <div className="pay-btn" onClick={() => { setSelectedPayment('card'); setShowPayModal(true); }}><div className="icon">💳</div><div className="name">刷卡</div><div className="desc">一卡通</div></div>
                    <div className="pay-btn" onClick={() => { setSelectedPayment('face'); setShowPayModal(true); }}><div className="icon">😊</div><div className="name">人脸识别</div><div className="desc">刷脸付</div></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="quick-actions">
                    <button className="action-btn secondary">挂单</button>
                    <button className="action-btn secondary">取单</button>
                    <button className="action-btn danger" onClick={clearOrder}>整单取消</button>
                    <button className="action-btn primary" onClick={() => setShowPayModal(true)} disabled={orderItems.length === 0}>确认收款</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {view === 'orders' && (
        <main>
          <h1 className="page-title">订单管理</h1>
          <div className="card">
            <div className="card-body">
              {orders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '60px', color: '#71767b'}}>暂无订单</div>
              ) : (
                <table className="order-table">
                  <thead>
                    <tr><th>订单号</th><th>金额</th><th>支付方式</th><th>状态</th><th>时间</th><th>操作</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.orderNo}</td>
                        <td className="price-cell">¥{Number(order.total).toFixed(2)}</td>
                        <td>{getPaymentName(order.paymentMethod)}</td>
                        <td><span className={`status-badge ${order.status}`}>{order.status === 'paid' ? '已支付' : order.status}</span></td>
                        <td>{new Date(order.createdAt).toLocaleString('zh-CN')}</td>
                        <td>
                          <button className="action-btn secondary" style={{padding: '4px 10px', fontSize: '12px'}} onClick={() => setSelectedOrder(order)}>查看</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      )}

      {view === 'users' && (
        <main>
          <h1 className="page-title">用户管理</h1>
          <div className="card">
            <div className="card-body">
              <table className="order-table">
                <thead>
                  <tr><th>ID</th><th>用户名</th><th>姓名</th><th>角色</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.name}</td>
                      <td>{u.role === 'admin' ? '管理员' : u.role === 'manager' ? '店长' : '店员'}</td>
                      <td><span className={`status-badge ${u.active ? 'paid' : 'pending'}`}>{u.active ? '启用' : '禁用'}</span></td>
                      <td>
                        <button className="action-btn secondary" style={{padding: '6px 12px', fontSize: '12px'}} onClick={() => toggleUserActive(u.id, u.active)}>
                          {u.active ? '禁用' : '启用'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {showWeightModal && (
        <div className="modal-overlay" onClick={() => setShowWeightModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>录入重量</h3>
            <div className="weight-dish-info">
              <span className="icon">{selectedDish?.icon}</span>
              <span className="name">{selectedDish?.name}</span>
              <span className="price">¥{selectedDish?.price}/斤</span>
            </div>
            <input
              type="number"
              className="weight-input"
              placeholder="输入重量(克)"
              value={manualWeight}
              onChange={e => setManualWeight(e.target.value)}
              autoFocus
            />
            <div className="weight-hint">不填则随机生成</div>
            <div className="modal-actions">
              <button className="action-btn secondary" onClick={() => setShowWeightModal(false)}>取消</button>
              <button className="action-btn primary" onClick={confirmAddDish}>确认添加</button>
            </div>
          </div>
        </div>
      )}

      {showPayModal && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>确认支付</h3>
            <div className="modal-amount">¥{total.toFixed(2)}</div>
            <div className="modal-payment">
              {selectedPayment === 'wechat' && '💚 微信支付'}
              {selectedPayment === 'alipay' && '💙 支付宝'}
              {selectedPayment === 'card' && '💳 刷卡'}
              {selectedPayment === 'face' && '😊 人脸识别'}
            </div>
            <div className="modal-actions">
              <button className="action-btn secondary" onClick={() => setShowPayModal(false)}>取消</button>
              <button className="action-btn primary" onClick={handlePayment}>确认支付</button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <h3>订单详情</h3>
            <div className="order-detail-header">
              <div className="detail-row"><span className="label">订单号：</span><span>{selectedOrder.orderNo}</span></div>
              <div className="detail-row"><span className="label">下单时间：</span><span>{new Date(selectedOrder.createdAt).toLocaleString('zh-CN')}</span></div>
              <div className="detail-row"><span className="label">支付方式：</span><span>{getPaymentName(selectedOrder.paymentMethod)}</span></div>
              <div className="detail-row"><span className="label">订单状态：</span><span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status === 'paid' ? '已支付' : selectedOrder.status}</span></div>
            </div>
            <div className="order-detail-items">
              <h4>菜品明细</h4>
              <table className="detail-table">
                <thead><tr><th>菜品</th><th>重量</th><th>单价</th><th>小计</th></tr></thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td><span className="item-icon">{item.dish?.icon || '🍽️'}</span> {item.dish?.name || '未知'}</td>
                      <td>{item.weight}g</td>
                      <td>¥{item.dish?.price || 0}/斤</td>
                      <td className="price-cell">¥{item.subtotal?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="order-detail-total">
              <span>合计：</span>
              <span className="total-price">¥{Number(selectedOrder.total).toFixed(2)}</span>
            </div>
            <div className="modal-actions">
              <button className="action-btn primary" onClick={() => setSelectedOrder(null)}>关闭</button>
            </div>
          </div>
        </div>
      )}

      <footer>麻辣烫收银系统 v1.0 | 政府机关食堂专用版</footer>
    </>
  )
}

export default App
