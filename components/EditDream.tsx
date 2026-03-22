import DreamForm from "./DreamForm";

export default function EditDream({ dreamId, onSave, onCancel }) {
  return <DreamForm dreamId={dreamId} onSave={onSave} onCancel={onCancel} />;
}
