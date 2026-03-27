import { InboxOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Row, Space, Typography, Upload, message } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { DataControls } from '../components/DataControls.jsx'
import { PageSection } from '../components/PageSection.jsx'
import { replaceMeals } from '../features/meals/mealsSlice.js'
import { replacePlan } from '../features/planner/plannerSlice.js'
import { replaceProducts } from '../features/products/productsSlice.js'
import {
  buildDatabaseImport,
  buildWeeklyPlanImport,
  parseCsvFile,
} from '../utils/csvImport.js'

const { Dragger } = Upload
const { Text } = Typography

export function ImportCsvPage() {
  const dispatch = useDispatch()
  const [databaseSummary, setDatabaseSummary] = useState(null)
  const [weeklySummary, setWeeklySummary] = useState(null)
  const [parsedMeals, setParsedMeals] = useState([])
  const [isImportReady, setIsImportReady] = useState(false)

  const handleDatabaseUpload = async (file) => {
    try {
      const rows = await parseCsvFile(file)
      const result = buildDatabaseImport(rows)
      setParsedMeals(result.meals)
      setDatabaseSummary({
        rows: rows.length,
        meals: result.meals.length,
        products: result.products.length,
        payload: result,
      })
      setIsImportReady(Boolean(result.meals.length || result.products.length))
      message.success(`Đã đọc file database: ${file.name}`)
    } catch {
      message.error('Không đọc được file database CSV.')
    }

    return false
  }

  const handleWeeklyUpload = async (file) => {
    try {
      const rows = await parseCsvFile(file)
      const plan = buildWeeklyPlanImport(rows, parsedMeals)
      setWeeklySummary({
        rows: rows.length,
        extraItems: plan.extraItems.length,
        payload: plan,
      })
      message.success(`Đã đọc file weekly plan: ${file.name}`)
    } catch {
      message.error('Không đọc được file weekly CSV.')
    }

    return false
  }

  const handleImport = () => {
    if (!databaseSummary?.payload) {
      message.warning('Bạn cần import file database trước.')
      return
    }

    dispatch(replaceMeals(databaseSummary.payload.meals))
    dispatch(replaceProducts(databaseSummary.payload.products))

    if (weeklySummary?.payload) {
      dispatch(replacePlan(weeklySummary.payload))
    }

    message.success('Đã import CSV vào app.')
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Alert
        type="info"
        showIcon
        message="Flow import đề xuất"
        description="Upload file Database trước để hệ thống map món ăn, sau đó mới upload Weekly Food để planner nối đúng meal IDs."
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <PageSection
            title="1. Import Database CSV"
            description="Đọc cột Tên sản phẩm, Tên món ăn và Nguyên liệu từ file database gốc."
          >
            <Dragger beforeUpload={handleDatabaseUpload} maxCount={1} accept=".csv">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p>Thả file Database.csv vào đây hoặc bấm để chọn file</p>
            </Dragger>

            {databaseSummary ? (
              <Space direction="vertical" size={4}>
                <Text>Số dòng đọc được: {databaseSummary.rows}</Text>
                <Text>Món ăn parse được: {databaseSummary.meals}</Text>
                <Text>Sản phẩm parse được: {databaseSummary.products}</Text>
              </Space>
            ) : null}
          </PageSection>
        </Col>

        <Col xs={24} xl={12}>
          <PageSection
            title="2. Import Weekly Food CSV"
            description="Đọc planner theo tuần và tự map sang meal IDs đã parse từ database."
          >
            <Dragger beforeUpload={handleWeeklyUpload} maxCount={1} accept=".csv">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p>Thả file Weekly Food.csv vào đây hoặc bấm để chọn file</p>
            </Dragger>

            {weeklySummary ? (
              <Space direction="vertical" size={4}>
                <Text>Số dòng đọc được: {weeklySummary.rows}</Text>
                <Text>Item mua thêm parse được: {weeklySummary.extraItems}</Text>
              </Space>
            ) : null}
          </PageSection>
        </Col>
      </Row>

      <PageSection
        title="3. Import vào app"
        description="Khi bấm nút này, dữ liệu hiện tại trong meals, products và weekly plan sẽ bị thay bằng dữ liệu CSV mới."
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Button type="primary" size="large" onClick={handleImport} disabled={!isImportReady}>
            Import CSV vào Shopping Memo App
          </Button>
          <DataControls />
        </Space>
      </PageSection>
    </Space>
  )
}
