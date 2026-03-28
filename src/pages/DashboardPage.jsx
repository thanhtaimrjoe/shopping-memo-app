import { Col, List, Row, Space, Tag, Typography } from 'antd'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'
import { selectChecklistItems } from '../features/planner/plannerSlice.js'
import { dayOptions } from '../utils/dayOptions.js'

const { Text } = Typography

export function DashboardPage() {
  const meals = useSelector((state) => state.meals.items)
  const products = useSelector((state) => state.products.items)
  const plan = useSelector((state) => state.planner.currentPlan)
  const checklistItems = useSelector(selectChecklistItems)

  const mealMap = useMemo(
    () => Object.fromEntries(meals.map((meal) => [meal.id, meal.name])),
    [meals],
  )

  const daySummary = useMemo(() => {
    return dayOptions.map((day) => ({
      ...day,
      mealNames: (plan.days[day.key] ?? []).map((mealId) => mealMap[mealId]).filter(Boolean),
    }))
  }, [mealMap, plan.days])

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <PageSection>
            <div className="metric-card__value">{meals.length}</div>
            <div className="metric-card__label">Món ăn đang lưu</div>
          </PageSection>
        </Col>
        <Col xs={24} md={8}>
          <PageSection>
            <div className="metric-card__value">{products.length}</div>
            <div className="metric-card__label">Sản phẩm hay mua</div>
          </PageSection>
        </Col>
        <Col xs={24} md={8}>
          <PageSection>
            <div className="metric-card__value">{checklistItems.length}</div>
            <div className="metric-card__label">Item trong checklist tuần này</div>
          </PageSection>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <PageSection
            title="Kế hoạch tuần hiện tại"
            description={`Tuần ${plan.weekLabel} đang có menu từ planner và danh sách mua thêm.`}
          >
            <List
              dataSource={daySummary}
              renderItem={(item) => (
                <List.Item>
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Text strong>{item.label}</Text>
                    {item.mealNames.length > 0 ? (
                      <div className="tag-list">
                        {item.mealNames.map((mealName) => (
                          <Tag key={`${item.key}-${mealName}`} color="blue">
                            {mealName}
                          </Tag>
                        ))}
                      </div>
                    ) : (
                      <Text className="helper-text">Chưa chọn món cho ngày này.</Text>
                    )}
                  </Space>
                </List.Item>
              )}
            />
          </PageSection>
        </Col>
        <Col xs={24} xl={10}>
          <PageSection
            title="Mua thêm"
            description="Những món không phụ thuộc trực tiếp vào thực đơn tuần."
          >
            <div className="tag-list">
              {plan.extraItems.map((item) => (
                <Tag key={item.id} color={item.checked ? 'green' : 'gold'}>
                  {item.name}
                </Tag>
              ))}
            </div>
          </PageSection>
        </Col>
      </Row>
    </Space>
  )
}
