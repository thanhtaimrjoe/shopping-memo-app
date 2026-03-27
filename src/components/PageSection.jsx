import { Card, Space, Typography } from 'antd'

const { Text, Title } = Typography

export function PageSection({ title, description, extra, children }) {
  return (
    <Card className="section-card" title={null} extra={extra} bordered={false}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {(title || description) && (
          <Space direction="vertical" size={4}>
            {title ? <Title level={4} style={{ margin: 0 }}>{title}</Title> : null}
            {description ? <Text className="helper-text">{description}</Text> : null}
          </Space>
        )}
        {children}
      </Space>
    </Card>
  )
}
