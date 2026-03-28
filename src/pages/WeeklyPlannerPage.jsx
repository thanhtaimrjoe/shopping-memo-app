import { DeleteOutlined, PlusOutlined, PictureOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { NoteActionButton } from '../components/NoteActionButton.jsx'
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
  const products = useSelector((state) => state.products.items)
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
        description="Tổ chức theo dạng grid để sau này dễ gắn thêm hình ảnh, và vẫn tiện quản lý các món mua rời ngoài thực đơn."
      >
        <PageSection
          title="Thêm item mới"
          description="Tạo nhanh một card mới cho danh sách mua thêm. Sau này phần này có thể mở rộng sang upload ảnh sản phẩm."
        >
          <Form
            form={extraItemForm}
            layout="vertical"
            onFinish={(values) => {
              dispatch(addExtraItem(values.name))
              extraItemForm.resetFields()
            }}
          >
            <Space style={{ width: '100%' }} align="start" wrap>
              <Form.Item
                name="name"
                style={{ flex: 1, minWidth: 280, marginBottom: 0 }}
                rules={[{ required: true, message: 'Vui lòng chọn item cần mua.' }]}
              >
                <Select
                  showSearch
                  size="large"
                  placeholder="Chọn từ Product Database"
                  optionFilterProp="label"
                  options={products.map((product) => ({
                    label: product.name,
                    value: product.name,
                  }))}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button htmlType="submit" type="primary" size="large" icon={<PlusOutlined />}>
                  Thêm từ database
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </PageSection>

        <div className="extra-items-grid">
          {plan.extraItems.map((item) => (
            <PageSection
              key={item.id}
              title={item.name}
              description={item.checked ? 'Đã có / đã xử lý' : 'Đang chờ xử lý'}
            >
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div className="extra-item-card__placeholder">
                  <Space direction="vertical" size={6} align="center">
                    <PictureOutlined style={{ fontSize: 24 }} />
                    <span>Chỗ dành cho hình ảnh sản phẩm</span>
                  </Space>
                </div>

                <div className="extra-item-card__actions">
                  <Tag color={item.checked ? 'green' : 'gold'}>
                    {item.checked ? 'Đã có / đã xử lý' : 'Cần mua'}
                  </Tag>

                  <div className="extra-item-card__actions-right">
                    <NoteActionButton
                      note={item.note}
                      onSave={(note) =>
                        dispatch(
                          updateExtraItem({
                            id: item.id,
                            name: item.name,
                            note,
                          }),
                        )
                      }
                      emptyLabel="Thêm ghi chú"
                      editLabel="Sửa ghi chú"
                      iconOnly
                    />
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => dispatch(deleteExtraItem(item.id))}
                      aria-label="Xóa item"
                    />
                  </div>
                </div>

                {item.note ? <Text className="helper-text">{item.note}</Text> : null}

                <Button
                  block
                  type={item.checked ? 'default' : 'primary'}
                  onClick={() => dispatch(toggleExtraItemChecked(item.id))}
                >
                  {item.checked ? 'Bỏ đánh dấu' : 'Đánh dấu đã có'}
                </Button>
              </Space>
            </PageSection>
          ))}
        </div>
      </PageSection>
    </Space>
  )
}
