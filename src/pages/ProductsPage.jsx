import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Segmented,
  Space,
  Table,
  Tag,
  Upload,
} from 'antd'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageSection } from '../components/PageSection.jsx'
import {
  addProduct,
  deleteProduct,
  setProductSearchText,
  updateProduct,
} from '../features/products/productsSlice.js'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })

export function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const searchText = useSelector((state) => state.products.searchText)
  const [form] = Form.useForm()
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table')
  const [imagePreview, setImagePreview] = useState('')
  const [uploadFileList, setUploadFileList] = useState([])

  const filteredProducts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) {
      return products
    }

    return products.filter((product) => product.name.toLowerCase().includes(keyword))
  }, [products, searchText])

  const resetProductModal = () => {
    setEditingProduct(null)
    setImagePreview('')
    setUploadFileList([])
    form.resetFields()
    setIsModalOpen(false)
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setImagePreview('')
    setUploadFileList([])
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setImagePreview(product.image ?? '')
    setUploadFileList(
      product.image
        ? [
            {
              uid: product.id,
              name: `${product.name}.png`,
              status: 'done',
              url: product.image,
            },
          ]
        : [],
    )
    form.setFieldsValue({ name: product.name })
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const payload = {
      name: values.name,
      image: imagePreview,
    }

    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct.id, ...payload }))
    } else {
      dispatch(addProduct(payload))
    }

    resetProductModal()
  }

  const handleBeforeUpload = async (file) => {
    const preview = await getBase64(file)
    setImagePreview(preview)
    setUploadFileList([
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: preview,
      },
    ])

    return false
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setUploadFileList([])
  }

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (value, record) =>
        value ? (
          <Image src={value} alt={record.name} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 12 }} />
        ) : (
          <div className="product-image product-image--placeholder">
            <PictureOutlined />
          </div>
        ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: 'Trạng thái ảnh',
      key: 'imageStatus',
      width: 160,
      render: (_, record) => (
        <Tag color={record.image ? 'green' : 'default'}>{record.image ? 'Đã có ảnh' : 'Chưa có ảnh'}</Tag>
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
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <PageSection
        title="Product Database"
        description="Quản lý các sản phẩm hay mua, có thể gắn hình ảnh để xem nhanh khi lên danh sách đi siêu thị."
        extra={
          <Space wrap>
            <Input.Search
              placeholder="Tìm theo tên sản phẩm"
              allowClear
              value={searchText}
              onChange={(event) => dispatch(setProductSearchText(event.target.value))}
              style={{ width: 280 }}
            />
            <Segmented
              value={viewMode}
              onChange={setViewMode}
              options={[
                { label: 'Table', value: 'table', icon: <UnorderedListOutlined /> },
                { label: 'Grid', value: 'grid', icon: <AppstoreOutlined /> },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
              Thêm sản phẩm
            </Button>
          </Space>
        }
      >
        <div className="helper-text" style={{ marginBottom: 16 }}>
          Hiện có {filteredProducts.length} sản phẩm{searchText ? ` khớp với từ khóa "${searchText}"` : ''}.
        </div>

        {viewMode === 'table' ? (
          <Table rowKey="id" columns={columns} dataSource={filteredProducts} pagination={{ pageSize: 8 }} />
        ) : filteredProducts.length ? (
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                <Card
                  className="product-card"
                  actions={[
                    <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleOpenEdit(product)}>
                      Sửa
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Xóa sản phẩm này?"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => dispatch(deleteProduct(product.id))}
                    >
                      <Button danger type="text" icon={<DeleteOutlined />}>
                        Xóa
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <div className="product-card__image-wrap">
                    {product.image ? (
                      <Image
                        preview={false}
                        src={product.image}
                        alt={product.name}
                        className="product-card__image"
                      />
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
                    <Tag color={product.image ? 'green' : 'default'}>
                      {product.image ? 'Đã có ảnh' : 'Chưa có ảnh'}
                    </Tag>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Không có sản phẩm nào khớp bộ lọc hiện tại." />
        )}
      </PageSection>

      <Modal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={resetProductModal}
        onOk={handleSubmit}
        okText={editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm.' }]}
          >
            <Input placeholder="Ví dụ: Sữa TH ít đường" />
          </Form.Item>

          <Form.Item label="Hình ảnh" style={{ marginBottom: imagePreview ? 12 : 0 }}>
            <Upload
              accept="image/*"
              listType="picture"
              maxCount={1}
              fileList={uploadFileList}
              beforeUpload={handleBeforeUpload}
              onRemove={handleRemoveImage}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh từ máy</Button>
            </Upload>
          </Form.Item>

          {imagePreview ? (
            <div className="product-form-preview">
              <Image
                src={imagePreview}
                alt="Preview"
                width={120}
                height={120}
                style={{ objectFit: 'cover', borderRadius: 12 }}
              />
            </div>
          ) : null}
        </Form>
      </Modal>
    </Space>
  )
}
