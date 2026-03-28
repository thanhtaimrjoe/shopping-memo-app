import { CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Progress, Row, Segmented, Space, Tag, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ChecklistNoteButton } from '../components/ChecklistNoteButton.jsx'
import { PageSection } from '../components/PageSection.jsx'
import {
  selectChecklistItems,
  selectFilteredChecklistItems,
  setChecklistFilter,
  toggleChecklistItemChecked,
  undoLastChecklistToggle,
  updateChecklistItemNote,
} from '../features/planner/plannerSlice.js'
import { dayOptions } from '../utils/dayOptions.js'

const { Text } = Typography

const getDayLabel = (dayKey) => dayOptions.find((day) => day.key === dayKey)?.label ?? dayKey

export function ShoppingChecklistPage() {
  const dispatch = useDispatch()
  const allChecklistItems = useSelector(selectChecklistItems)
  const checklistItems = useSelector(selectFilteredChecklistItems)
  const checklistFilter = useSelector((state) => state.planner.checklistFilter)
  const lastChecklistToggle = useSelector((state) => state.planner.lastChecklistToggle)
  const completedChecklistCount = allChecklistItems.filter((item) => item.checked).length
  const completionPercent = allChecklistItems.length
    ? Math.round((completedChecklistCount / allChecklistItems.length) * 100)
    : 0

  if (checklistItems.length === 0) {
    return <Empty description="Chưa có dữ liệu cho checklist." />
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <PageSection
          title="Shopping progress"
          description="Theo dõi nhanh tiến độ xử lý checklist trước khi đi siêu thị."
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Progress percent={completionPercent} status="active" />
            <Text className="helper-text">
              Đã xử lý {completedChecklistCount}/{allChecklistItems.length} item.
            </Text>
          </Space>
        </PageSection>
      </Col>
      <Col xs={24}>
        <PageSection
          title="Bộ lọc checklist"
          description="Dùng để tập trung vào những món còn phải mua hoặc những món đã xử lý xong."
        >
          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Segmented
              value={checklistFilter}
              onChange={(value) => dispatch(setChecklistFilter(value))}
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Chưa xong', value: 'pending' },
                { label: 'Đã xong', value: 'done' },
              ]}
            />
            <Button onClick={() => dispatch(undoLastChecklistToggle())} disabled={!lastChecklistToggle}>
              Hoàn tác
            </Button>
          </Space>
        </PageSection>
      </Col>
      <Col xs={24}>
        <PageSection
          title="Shopping checklist"
          description="Danh sách tổng hợp các món cần xử lý cho tuần này, gồm cả nguyên liệu từ thực đơn và các món mua thêm."
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {checklistItems.map((item) => (
              <PageSection key={item.id}>
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <Space wrap>
                    {item.checked ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <ShoppingCartOutlined />}
                    <strong>{item.name}</strong>
                    <Tag color={item.source === 'ingredient' ? 'blue' : 'purple'}>
                      {item.source === 'ingredient' ? 'Nguyên liệu' : 'Mua thêm'}
                    </Tag>
                    {item.checked ? <Tag color="green">Đã xong</Tag> : <Tag color="gold">Chưa xong</Tag>}
                  </Space>

                  {item.source === 'ingredient' ? (
                    <>
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
                    </>
                  ) : null}

                  <ChecklistNoteButton
                    note={item.note}
                    onSave={(note) => dispatch(updateChecklistItemNote({ id: item.id, note }))}
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
