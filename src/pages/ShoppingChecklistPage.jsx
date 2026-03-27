import { CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Col, Empty, List, Row, Space, Tag, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'
import { selectChecklistItems } from '../features/planner/plannerSlice.js'
import { dayOptions } from '../utils/dayOptions.js'

const { Text } = Typography

const getDayLabel = (dayKey) => dayOptions.find((day) => day.key === dayKey)?.label ?? dayKey

export function ShoppingChecklistPage() {
  const checklistItems = useSelector(selectChecklistItems)
  const ingredientItems = checklistItems.filter((item) => item.source === 'ingredient')
  const extraItems = checklistItems.filter((item) => item.source === 'extra')

  if (checklistItems.length === 0) {
    return <Empty description="Chưa có dữ liệu cho checklist." />
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={14}>
        <PageSection
          title="Nguyên liệu cần mua"
          description="Gom từ tất cả món đã chọn trong Weekly Planner. Các nguyên liệu trùng sẽ được gộp lại."
        >
          <List
            dataSource={ingredientItems}
            renderItem={(item) => (
              <List.Item>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Space wrap>
                    <ShoppingCartOutlined />
                    <strong>{item.name}</strong>
                  </Space>
                  <Space wrap>
                    {item.dayKeys.map((dayKey) => (
                      <Tag key={`${item.id}-${dayKey}`} color="blue">
                        {getDayLabel(dayKey)}
                      </Tag>
                    ))}
                  </Space>
                  <Text className="helper-text">
                    Dùng cho: {Array.from(new Set(item.mealNames)).join(', ')}
                  </Text>
                </Space>
              </List.Item>
            )}
          />
        </PageSection>
      </Col>
      <Col xs={24} xl={10}>
        <PageSection
          title="Mua thêm"
          description="Danh sách riêng cho các món ngoài thực đơn tuần."
        >
          <List
            dataSource={extraItems}
            renderItem={(item) => (
              <List.Item>
                <Space direction="vertical" size={6} style={{ width: '100%' }}>
                  <Space wrap>
                    {item.checked ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ShoppingCartOutlined />}
                    <strong>{item.name}</strong>
                    {item.checked ? <Tag color="green">Đã có</Tag> : <Tag color="gold">Cần mua</Tag>}
                  </Space>
                  {item.note ? <Text className="helper-text">{item.note}</Text> : null}
                </Space>
              </List.Item>
            )}
          />
        </PageSection>
      </Col>
    </Row>
  )
}
