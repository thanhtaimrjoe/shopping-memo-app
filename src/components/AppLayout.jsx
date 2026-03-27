import {
  CalendarOutlined,
  DashboardOutlined,
  ImportOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Card, Grid, Layout, Menu, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography
const { useBreakpoint } = Grid

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/meals',
    icon: <UnorderedListOutlined />,
    label: 'Meal Database',
  },
  {
    key: '/products',
    icon: <ShopOutlined />,
    label: 'Product Database',
  },
  {
    key: '/planner',
    icon: <CalendarOutlined />,
    label: 'Weekly Planner',
  },
  {
    key: '/checklist',
    icon: <ShoppingCartOutlined />,
    label: 'Shopping Checklist',
  },
  {
    key: '/import',
    icon: <ImportOutlined />,
    label: 'Import CSV',
  },
]

const pageTitles = {
  '/dashboard': {
    title: 'Shopping Memo App',
    subtitle: 'Lên menu trong tuần, gom nguyên liệu, và biến danh sách đi siêu thị thành checklist dễ dùng.',
  },
  '/meals': {
    title: 'Meal Database',
    subtitle: 'Quản lý danh sách món ăn và nguyên liệu nền để reuse cho các tuần sau.',
  },
  '/products': {
    title: 'Product Database',
    subtitle: 'Lưu những sản phẩm hai bạn thường mua ngoài phần nguyên liệu món ăn.',
  },
  '/planner': {
    title: 'Weekly Planner',
    subtitle: 'Chọn món cho từng ngày và thêm các món cần mua riêng trong tuần.',
  },
  '/checklist': {
    title: 'Shopping Checklist',
    subtitle: 'Tổng hợp nguyên liệu và đồ mua thêm thành danh sách mang đi siêu thị.',
  },
  '/import': {
    title: 'Import CSV',
    subtitle: 'Nạp dữ liệu từ file CSV hiện tại của hai bạn vào app thay vì nhập tay.',
  },
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const screens = useBreakpoint()
  const currentPage = pageTitles[location.pathname] ?? pageTitles['/dashboard']

  return (
    <Layout className="page-shell">
      <Sider
        width={260}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        className="app-sider"
        theme="dark"
      >
        <div className="app-brand">
          <Title level={3} className="app-brand__title">
            Shopping Memo
          </Title>
          <Text className="app-brand__subtitle">
            React + Redux Toolkit + Ant Design
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Card className="app-header-card" bordered={false}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Breadcrumb
                items={[
                  { title: 'Shopping Memo' },
                  { title: currentPage.title },
                ]}
              />
              <Space
                align="start"
                style={{ width: '100%', justifyContent: 'space-between' }}
                wrap
              >
                <div>
                  <Title level={2} className="page-title">
                    {currentPage.title}
                  </Title>
                  <Text className="page-subtitle">{currentPage.subtitle}</Text>
                </div>
                <Button type="default">{dayjs().format('DD/MM/YYYY')}</Button>
              </Space>
            </Space>
          </Card>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
