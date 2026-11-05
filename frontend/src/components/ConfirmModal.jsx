export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon"><i className="bi bi-trash3"></i></div>
        <h5>{title}</h5>
        <p>{message}</p>
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-soft" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger-solid" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
