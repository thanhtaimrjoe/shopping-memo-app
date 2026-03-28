import { NoteActionButton } from './NoteActionButton.jsx'

export function ChecklistNoteButton({ note, onSave }) {
  return (
    <NoteActionButton
      note={note}
      onSave={onSave}
      emptyLabel="Ghi chú"
      editLabel="Sửa ghi chú"
    />
  )
}
