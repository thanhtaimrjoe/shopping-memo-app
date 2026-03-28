import { DeleteOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
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

const getUniqueIngredients = (selectedMeals) => {
  const seen = new Set()
  const ingredients = []

  selectedMeals.forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const normalizedIngredient = ingredient.trim().toLowerCase()

      if (!normalizedIngredient || seen.has(normalizedIngredient)) {
        return
      }

      seen.add(normalizedIngredient)
      ingredients.push(ingredient)
    })
  })

  return ingredients
}

export function WeeklyPlannerPage() {
  const dispatch = useDispatch()
  const meals = useSelector((state) => state.meals.items)
  const products = useSelector((state) => state.products.items)
  const plan = useSelector((state) => state.planner.currentPlan)
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false)
  const [detailDayKey, setDetailDayKey] = useState(null)

  const mealsById = useMemo(() => Object.fromEntries(meals.map((meal) => [meal.id, meal])), [meals])

  const extraItemNameSet = useMemo(
    () => new Set(plan.extraItems.map((item) => item.name.trim().toLowerCase())),
    [plan.extraItems],
  )

  const productCards = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        alreadyAdded: extraItemNameSet.has(product.name.trim().toLowerCase()),
      })),
    [products, extraItemNameSet],
  )

  const selectedDayMeals = detailDayKey
    ? (plan.days[detailDayKey] ?? []).map((mealId) => mealsById[mealId]).filter(Boolean)
    : []
  const selectedDayIngredients = getUniqueIngredients(selectedDayMeals)
  const detailDayLabel = dayOptions.find((day) => day.key === detailDayKey)?.label ?? ''

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
          {dayOptions.map((day) => {
            const selectedMeals = (plan.days[day.key] ?? []).map((mealId) => mealsById[mealId]).filter(Boolean)
            const uniqueIngredients = getUniqueIngredients(selectedMeals)

            return (
              <Col xs={24} md={12} xl={8} key={day.key}>
                <PageSection title={day.label}>
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Select
                      mode="multiple"
                      showSearch
                      optionFilterProp="label"
                      style={{ width: '100%' }}
                      placeholder="Chọn món ăn"
                      value={plan.days[day.key]}
                      onChange={(mealIds) => dispatch(setMealsForDay({ dayKey: day.key, mealIds }))}
                      options={meals.map((meal) => ({
                        label: meal.name,
                        value: meal.id,
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                    />

                    <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
                      <Text className="helper-text">
                        {selectedMeals.length} món · {uniqueIngredients.length} nguyên liệu
                      </Text>
                      <Button
                        type="link"
                        style={{ paddingInline: 0 }}
                        disabled={!selectedMeals.length}
                        onClick={() => setDetailDayKey(day.key)}
                      >
                        Xem chi tiết
                      </Button>
                    </Space>
                  </Space>
                </PageSection>
              </Col>
            )
          })}
        </Row>
      </PageSection>

      <PageSection
        title="Mua thêm"
        description="Tổ chức theo dạng grid để dễ quản lý các món mua rời ngoài thực đơn."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsProductPickerOpen(true)}>
            Thêm từ database
          </Button>
        }
      >
        <div className="extra-items-grid">
          {plan.extraItems.map((item) => (
            <PageSection
              key={item.id}
              title={item.name}
              description={item.checked ? 'Đã có / đã xử lý' : 'Đang chờ xử lý'}
            >
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {item.image ? (
                  <Image
                    preview={false}
                    src={item.image}
                    alt={item.name}
                    className="product-card__image"
                  />
                ) : (
                  <div className="extra-item-card__placeholder">
                    <Space direction="vertical" size={6} align="center">
                      <PictureOutlined style={{ fontSize: 24 }} />
                      <span>Chưa có hình ảnh sản phẩm</span>
                    </Space>
                  </div>
                )}

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
                            image: item.image,
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

      <Modal
        title="Product Database"
        open={isProductPickerOpen}
        onCancel={() => setIsProductPickerOpen(false)}
        footer={null}
        width={980}
      >
        <div className="weekly-product-picker-grid">
          {productCards.map((product) => (
            <div key={product.id} className="weekly-product-picker-card">
              <div className="product-card__image-wrap">
                {product.image ? (
                  <Image preview={false} src={product.image} alt={product.name} className="product-card__image" />
                ) : (
                  <div className="product-image product-image--placeholder product-card__image-placeholder">
                    <Space direction="vertical" size={4} align="center">
                      <PictureOutlined />
                      <span>Chưa có ảnh</span>
                    </Space>
                  </div>
                )}
              </div>

              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <strong>{product.name}</strong>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  disabled={product.alreadyAdded}
                  onClick={() => {
                    dispatch(addExtraItem({ name: product.name, image: product.image }))
                  }}
                >
                  {product.alreadyAdded ? 'Đã thêm' : 'Thêm vào Mua thêm'}
                </Button>
              </Space>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        title={detailDayLabel ? `Chi tiết nguyên liệu - ${detailDayLabel}` : 'Chi tiết nguyên liệu'}
        open={Boolean(detailDayKey)}
        onCancel={() => setDetailDayKey(null)}
        footer={null}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {selectedDayMeals.length ? (
            selectedDayMeals.map((meal) => (
              <div key={meal.id}>
                <Text strong>{meal.name}</Text>
                <div className="tag-list" style={{ marginTop: 8 }}>
                  {meal.ingredients.map((ingredient) => (
                    <Tag key={`${meal.id}-${ingredient}`} color="blue">
                      {ingredient}
                    </Tag>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Text className="helper-text">Chưa có món nào được chọn cho ngày này.</Text>
          )}
        </Space>
      </Modal>
    </Space>
  )
}
