import "./Modal.css";

export default function Modal({
  aberto,
  titulo,
  children,
  onClose,
  footer,
  tamanho = "md"
}) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box ${tamanho}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{titulo}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}