import { Card, Space, Typography } from 'antd'

const { Text, Title } = Typography

export function PageSection({ title, description, extra, children }) {
  return (
    <Card className="section-card" title={null} bordered={false}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {(title || description || extra) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {(title || description) && (
              <Space direction="vertical" size={4} style={{ minWidth: 0 }}>
                {title ? <Title level={4} style={{ margin: 0 }}>{title}</Title> : null}
                {description ? <Text className="helper-text">{description}</Text> : null}
              </Space>
            )}

            {extra ? <div>{extra}</div> : null}
          </div>
        )}
        {children}
      </Space>
    </Card>
  )
}
