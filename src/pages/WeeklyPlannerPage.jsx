import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'

const { Text } = Typography
import {
  addExtraItem,
  deleteExtraItem,
  setMealsForDay,
  setWeekLabel,
  toggleExtraItemChecked,
  updateExtraItem,
  updatePlanNotes,
} from '../features/planner/plannerSlice.js'
import { dayOptions } from '../utils/dayOptions.js'

export function WeeklyPlannerPage() {
  const dispatch = useDispatch()
  const meals = useSelector((state) => state.meals.items)
  const plan = useSelector((state) => state.planner.currentPlan)
  const [extraItemForm] = Form.useForm()

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <PageSection
        title="Thông tin tuần"
        description="Chọn label cho tuần để sau này mình gắn với API hoặc database cũng vẫn sạch."
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form layout="vertical">
              <Form.Item label="Week label">
                <Input
                  value={plan.weekLabel}
                  onChange={(event) => dispatch(setWeekLabel(event.target.value))}
                  placeholder="Ví dụ: 23/03 - 27/03"
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} md={12}>
            <Form layout="vertical">
              <Form.Item label="Ghi chú tuần">
                <Input.TextArea
                  rows={4}
                  value={plan.notes}
                  onChange={(event) => dispatch(updatePlanNotes(event.target.value))}
                  placeholder="Ví dụ: Ưu tiên món dễ nấu vì cuối tuần bận"
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </PageSection>

      <PageSection
        title="Chọn món cho từng ngày"
        description="Một ngày có thể chọn nhiều món. App sẽ tổng hợp nguyên liệu bên phần checklist."
      >
        <Row gutter={[16, 16]}>
          {dayOptions.map((day) => (
            <Col xs={24} md={12} xl={8} key={day.key}>
              <PageSection title={day.label}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Chọn món ăn"
                  value={plan.days[day.key]}
                  onChange={(mealIds) => dispatch(setMealsForDay({ dayKey: day.key, mealIds }))}
                  options={meals.map((meal) => ({
                    label: meal.name,
                    value: meal.id,
                  }))}
                />
              </PageSection>
            </Col>
          ))}
        </Row>
      </PageSection>

      <PageSection
        title="Mua thêm"
        description="Dùng cho các món không gắn trực tiếp với thực đơn, ví dụ sữa, snack, tissue."
      >
        <Form
          form={extraItemForm}
          layout="inline"
          onFinish={(values) => {
            dispatch(addExtraItem(values.name))
            extraItemForm.resetFields()
          }}
        >
          <Form.Item
            name="name"
            style={{ flex: 1, minWidth: 280 }}
            rules={[{ required: true, message: 'Vui lòng nhập item cần mua.' }]}
          >
            <Input placeholder="Nhập item mua thêm" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" icon={<PlusOutlined />}>
              Thêm
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <List
          dataSource={plan.extraItems}
          locale={{ emptyText: 'Chưa có item mua thêm.' }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="toggle"
                  type={item.checked ? 'default' : 'primary'}
                  onClick={() => dispatch(toggleExtraItemChecked(item.id))}
                >
                  {item.checked ? 'Bỏ đánh dấu' : 'Đánh dấu đã có'}
                </Button>,
                <Button
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => dispatch(deleteExtraItem(item.id))}
                />,
              ]}
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space wrap>
                  <strong>{item.name}</strong>
                  {item.checked ? <Tag color="green">Đã có / đã xử lý</Tag> : null}
                </Space>
                <Input
                  value={item.note}
                  placeholder="Ghi chú, ví dụ: đã có ở nhà"
                  onChange={(event) =>
                    dispatch(
                      updateExtraItem({
                        id: item.id,
                        name: item.name,
                        note: event.target.value,
                      }),
                    )
                  }
                />
                <Text className="helper-text">
                  Tip: phần note này sẽ hiện lại ở Shopping Checklist.
                </Text>
              </Space>
            </List.Item>
          )}
        />
      </PageSection>
    </Space>
  )
}
