import { ReloadOutlined, ClearOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, message } from 'antd'
import { useDispatch } from 'react-redux'
import { replaceMeals } from '../features/meals/mealsSlice.js'
import { clearPlannerState, resetPlannerState } from '../features/planner/plannerSlice.js'
import { replaceProducts } from '../features/products/productsSlice.js'
import { initialMeals, initialProducts } from '../store/sampleData.js'
import { clearState } from '../store/storage.js'

export function DataControls() {
  const dispatch = useDispatch()

  const handleResetSampleData = () => {
    dispatch(replaceMeals(initialMeals))
    dispatch(replaceProducts(initialProducts))
    dispatch(resetPlannerState())
    message.success('Đã reset về sample data ban đầu.')
  }

  const handleClearAllData = () => {
    clearState()
    dispatch(replaceMeals([]))
    dispatch(replaceProducts([]))
    dispatch(clearPlannerState())
    message.success('Đã xóa dữ liệu local hiện tại.')
  }

  return (
    <Space wrap>
      <Popconfirm
        title="Reset về sample data?"
        description="Meals, products và planner hiện tại sẽ bị thay bằng dữ liệu mẫu ban đầu."
        okText="Reset"
        cancelText="Hủy"
        onConfirm={handleResetSampleData}
      >
        <Button icon={<ReloadOutlined />}>Reset sample data</Button>
      </Popconfirm>

      <Popconfirm
        title="Xóa dữ liệu local?"
        description="Dữ liệu trong localStorage sẽ bị xóa và app sẽ về trạng thái trống hơn để bạn test lại import."
        okText="Xóa"
        cancelText="Hủy"
        onConfirm={handleClearAllData}
      >
        <Button danger icon={<ClearOutlined />}>Clear local data</Button>
      </Popconfirm>
    </Space>
  )
}
