export default function ConfirmPopup({
  show,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-[#0b2a45] text-white",
  width = "w-[350px]",
  onCancel,
  onConfirm
}) {
  return (
    <div
      className={`fixed left-1/2 transform -translate-x-1/2 z-[9999]
        transition-all duration-300 ease-out
        ${show ? "top-10 opacity-100" : "-top-40 opacity-0"}
      `}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <div className={`bg-white shadow-lg rounded-lg p-6 ${width}`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={`px-4 py-2 rounded ${confirmColor}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
