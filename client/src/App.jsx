import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await axios.get("http://localhost:5000/documents");
    setDocuments(res.data);
  };

  const handleUpload = async (e) => {

    const selectedFiles = Array.from(e.target.files);

    setFiles(
      selectedFiles.map((file) => ({
        name: file.name,
        progress: 0,
      }))
    );

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    await axios.post("http://localhost:5000/upload", formData, {

      onUploadProgress: (progressEvent) => {

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        setFiles((prev) =>
          prev.map((file) => ({
            ...file,
            progress: percent,
          }))
        );
      },
    });

    fetchDocuments();
  };

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

        <div className="bg-white rounded-2xl p-10 shadow-sm border mb-10">

          <h2 className="text-2xl font-semibold mb-4">
            Upload PDF Files
          </h2>

          <div className="border-2 border-dashed border-blue-300 rounded-2xl p-16 text-center">

            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleUpload}
              className="mb-6"
            />

            <p className="text-gray-500 text-lg">
              Upload one or multiple PDFs
            </p>

          </div>

          <div className="mt-6 space-y-4">

            {files.map((file, index) => (

              <div key={index}>

                <div className="flex justify-between mb-1">
                  <span>{file.name}</span>
                  <span>{file.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${file.progress}%` }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="bg-white rounded-2xl p-10 shadow-sm border">

          <h2 className="text-2xl font-semibold mb-6">
            Uploaded Documents
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">File Name</th>
                <th className="text-left py-3">Size</th>

              </tr>

            </thead>

            <tbody>

              {documents.map((doc, index) => (

                <tr key={index} className="border-b">

                  <td className="py-3">{doc.name}</td>

                  <td className="py-3">
                    {(doc.size / 1024).toFixed(2)} KB
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default App;