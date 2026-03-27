import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'
import {
  addMeal,
  deleteMeal,
  setMealSearchText,
  updateMeal,
} from '../features/meals/mealsSlice.js'

export function MealsPage() {
  const dispatch = useDispatch()
  const meals = useSelector((state) => state.meals.items)
  const searchText = useSelector((state) => state.meals.searchText)
  const [form] = Form.useForm()
  const [editingMeal, setEditingMeal] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredMeals = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) {
      return meals
    }

    return meals.filter((meal) => {
      const ingredientText = meal.ingredients.join(' ').toLowerCase()
      return (
        meal.name.toLowerCase().includes(keyword) || ingredientText.includes(keyword)
      )
    })
  }, [meals, searchText])

  const handleOpenCreate = () => {
    setEditingMeal(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleOpenEdit = (meal) => {
    setEditingMeal(meal)
    form.setFieldsValue({
      name: meal.name,
      ingredients: meal.ingredients.join(', '),
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const payload = {
      name: values.name,
      ingredients: values.ingredients
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    if (editingMeal) {
      dispatch(updateMeal({ id: editingMeal.id, ...payload }))
    } else {
      dispatch(addMeal(payload))
    }

    setIsModalOpen(false)
    form.resetFields()
  }

  const columns = [
    {
      title: 'Tên món',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: 'Nguyên liệu',
      dataIndex: 'ingredients',
      key: 'ingredients',
      render: (ingredients) => (
        <Space wrap>
          {ingredients.map((ingredient) => (
            <Tag key={ingredient}>{ingredient}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm
            title="Xóa món ăn này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => dispatch(deleteMeal(record.id))}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageSection
      title="Danh sách món ăn"
      description="Property và state dùng tiếng Anh, nhưng data hiển thị tiếng Việt như bạn dặn."
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm theo tên món hoặc nguyên liệu"
            allowClear
            value={searchText}
            onChange={(event) => dispatch(setMealSearchText(event.target.value))}
            style={{ width: 280 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm món
          </Button>
        </Space>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={filteredMeals} pagination={{ pageSize: 8 }} />

      <Modal
        title={editingMeal ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={editingMeal ? 'Lưu' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên món"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên món.' }]}
          >
            <Input placeholder="Ví dụ: Canh bí đỏ" />
          </Form.Item>
          <Form.Item
            label="Nguyên liệu"
            name="ingredients"
            rules={[{ required: true, message: 'Vui lòng nhập nguyên liệu.' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập nguyên liệu, ngăn cách bằng dấu phẩy"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageSection>
  )
}
