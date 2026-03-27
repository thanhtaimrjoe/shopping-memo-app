import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'
import {
  addProduct,
  deleteProduct,
  setProductSearchText,
  updateProduct,
} from '../features/products/productsSlice.js'

export function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const searchText = useSelector((state) => state.products.searchText)
  const [form] = Form.useForm()
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) {
      return products
    }

    return products.filter((product) => product.name.toLowerCase().includes(keyword))
  }, [products, searchText])

  const handleOpenCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    form.setFieldsValue({ name: product.name })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct.id, name: values.name }))
    } else {
      dispatch(addProduct(values.name))
    }

    setIsModalOpen(false)
    form.resetFields()
  }

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm
            title="Xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => dispatch(deleteProduct(record.id))}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageSection
      title="Danh sách sản phẩm"
      description="Những món hay mua ngoài nguyên liệu món ăn như sữa, snack, tissue..."
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm theo tên sản phẩm"
            allowClear
            value={searchText}
            onChange={(event) => dispatch(setProductSearchText(event.target.value))}
            style={{ width: 280 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm sản phẩm
          </Button>
        </Space>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={filteredProducts} pagination={{ pageSize: 8 }} />

      <Modal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={editingProduct ? 'Lưu' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm.' }]}
          >
            <Input placeholder="Ví dụ: Sữa TH" />
          </Form.Item>
        </Form>
      </Modal>
    </PageSection>
  )
}
