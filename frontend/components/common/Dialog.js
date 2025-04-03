export default function Dialog({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    )
  }