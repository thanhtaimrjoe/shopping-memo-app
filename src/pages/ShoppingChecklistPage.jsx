import { CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Input, Row, Segmented, Space, Statistic, Tag, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'
import {
  selectFilteredChecklistItems,
  setChecklistFilter,
  toggleChecklistItemChecked,
  updateChecklistItemNote,
} from '../features/planner/plannerSlice.js'
import { dayOptions } from '../utils/dayOptions.js'

const { Text } = Typography

const getDayLabel = (dayKey) => dayOptions.find((day) => day.key === dayKey)?.label ?? dayKey

export function ShoppingChecklistPage() {
  const dispatch = useDispatch()
  const checklistItems = useSelector(selectFilteredChecklistItems)
  const checklistFilter = useSelector((state) => state.planner.checklistFilter)
  const ingredientItems = checklistItems.filter((item) => item.source === 'ingredient')
  const extraItems = checklistItems.filter((item) => item.source === 'extra')

  if (checklistItems.length === 0) {
    return <Empty description="Chưa có dữ liệu cho checklist." />
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <PageSection
          title="Bộ lọc checklist"
          description="Dùng để tập trung vào những món còn phải mua hoặc những món đã xử lý xong."
        >
          <Segmented
            value={checklistFilter}
            onChange={(value) => dispatch(setChecklistFilter(value))}
            options={[
              { label: 'Tất cả', value: 'all' },
              { label: 'Chưa xong', value: 'pending' },
              { label: 'Đã xong', value: 'done' },
            ]}
          />
        </PageSection>
      </Col>
      <Col xs={24} md={8}>
        <PageSection>
          <Statistic title="Tổng item đang hiển thị" value={checklistItems.length} />
        </PageSection>
      </Col>
      <Col xs={24} md={8}>
        <PageSection>
          <Statistic title="Nguyên liệu từ thực đơn" value={ingredientItems.length} />
        </PageSection>
      </Col>
      <Col xs={24} md={8}>
        <PageSection>
          <Statistic title="Mua thêm" value={extraItems.length} />
        </PageSection>
      </Col>
      <Col xs={24} xl={14}>
        <PageSection
          title="Nguyên liệu cần mua"
          description="Gom từ tất cả món đã chọn trong Weekly Planner. Các nguyên liệu trùng sẽ được gộp lại."
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {ingredientItems.map((item) => (
              <PageSection key={item.id}>
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <Space wrap>
                    {item.checked ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ShoppingCartOutlined />}
                    <strong>{item.name}</strong>
                    {item.checked ? <Tag color="green">Đã xong</Tag> : <Tag color="blue">Chưa xong</Tag>}
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
                  <Input
                    value={item.note}
                    placeholder="Ghi chú cho item này"
                    onChange={(event) =>
                      dispatch(updateChecklistItemNote({ id: item.id, note: event.target.value }))
                    }
                  />
                  <Button onClick={() => dispatch(toggleChecklistItemChecked(item.id))}>
                    {item.checked ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                  </Button>
                </Space>
              </PageSection>
            ))}
          </Space>
        </PageSection>
      </Col>
      <Col xs={24} xl={10}>
        <PageSection
          title="Mua thêm"
          description="Danh sách riêng cho các món ngoài thực đơn tuần."
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {extraItems.map((item) => (
              <PageSection key={item.id}>
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <Space wrap>
                    {item.checked ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ShoppingCartOutlined />}
                    <strong>{item.name}</strong>
                    {item.checked ? <Tag color="green">Đã có</Tag> : <Tag color="gold">Cần mua</Tag>}
                  </Space>
                  <Input
                    value={item.note}
                    placeholder="Ghi chú cho item này"
                    onChange={(event) =>
                      dispatch(updateChecklistItemNote({ id: item.id, note: event.target.value }))
                    }
                  />
                  <Button onClick={() => dispatch(toggleChecklistItemChecked(item.id))}>
                    {item.checked ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                  </Button>
                </Space>
              </PageSection>
            ))}
          </Space>
        </PageSection>
      </Col>
    </Row>
  )
}
