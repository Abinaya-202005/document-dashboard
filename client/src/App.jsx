function App() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] p-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700">
            Document Dashboard
          </h1>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
            Notifications
          </button>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-sm border">
          <h2 className="text-2xl font-semibold mb-4">
            Upload PDF Files
          </h2>

          <div className="border-2 border-dashed border-blue-300 rounded-2xl p-16 text-center">
            <p className="text-gray-500 text-lg">
              Drag & Drop PDFs Here
            </p>

            <button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl">
              Select Files
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
