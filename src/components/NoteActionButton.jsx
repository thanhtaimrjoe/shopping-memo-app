import { EditOutlined, FileTextOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Tooltip } from 'antd'
import { useState } from 'react'

export function NoteActionButton({
  note,
  onSave,
  emptyLabel = 'Ghi chú',
  editLabel = 'Sửa ghi chú',
  iconOnly = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draftNote, setDraftNote] = useState(note ?? '')

  const handleOpen = () => {
    setDraftNote(note ?? '')
    setIsModalOpen(true)
  }

  const handleSave = () => {
    onSave(draftNote)
    setIsModalOpen(false)
  }

  return (
    <>
      <Space direction="vertical" size={6} style={{ width: '100%' }}>
        <Tooltip title={note ? editLabel : emptyLabel}>
          <Button
            icon={note ? <EditOutlined /> : <FileTextOutlined />}
            onClick={handleOpen}
            aria-label={note ? editLabel : emptyLabel}
          >
            {iconOnly ? null : note ? editLabel : emptyLabel}
          </Button>
        </Tooltip>
      </Space>

      <Modal
        title={note ? editLabel : emptyLabel}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          value={draftNote}
          onChange={(event) => setDraftNote(event.target.value)}
          placeholder="Nhập ghi chú"
        />
      </Modal>
    </>
  )
}
