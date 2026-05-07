import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {

  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    fetchDocuments();
    fetchNotifications();

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

  }, []);

  const fetchDocuments = async () => {

    const res = await axios.get(
      "http://localhost:5000/documents"
    );

    setDocuments(res.data);

  };

  const fetchNotifications = async () => {

    const res = await axios.get(
      "http://localhost:5000/notifications"
    );

    setNotifications(res.data);

  };

  const handleUpload = async (e) => {

    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      alert("Processing files in background...");
    }

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

    await axios.post(
      "http://localhost:5000/upload",
      formData,
      {

        onUploadProgress: (progressEvent) => {

          const percent = Math.round(
            (progressEvent.loaded * 100) /
            progressEvent.total
          );

          setFiles((prev) =>
            prev.map((file) => ({
              ...file,
              progress: percent,
            }))
          );

        },

      }
    );

    fetchDocuments();
    fetchNotifications();

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight">

              Document Dashboard

            </h1>

            <p className="text-gray-500 mt-2">

              Manage company PDF documents with realtime tracking

            </p>

          </div>

          <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-2xl relative shadow-lg">

            🔔 Notifications

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">

              {notifications.length}

            </span>

          </button>

        </div>

        <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 mb-10 hover:shadow-xl transition-all">

          <h2 className="text-3xl font-bold mb-6 text-gray-800">

            Upload PDF Files

          </h2>

          <label
  className="border-2 border-dashed border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-16 text-center hover:scale-[1.01] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center"
>

  <div className="bg-blue-600 text-white p-5 rounded-full shadow-lg mb-6 text-3xl">

    📄

  </div>

  <h3 className="text-2xl font-bold text-gray-700 mb-2">

    Upload PDF Documents

  </h3>

  <p className="text-gray-500 mb-6">

    Drag & drop your files here or browse manually

  </p>

  <div className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-2xl font-medium shadow-lg">

    Choose Files

  </div>

  <p className="text-sm text-gray-400 mt-5">

    Supports multiple PDF uploads

  </p>

  <input
    type="file"
    multiple
    accept=".pdf"
    onChange={handleUpload}
    className="hidden"
  />

</label>

          <div className="mt-8 space-y-6">

            {files.map((file, index) => (

              <div
                key={index}
                className="bg-gray-50 p-4 rounded-2xl border"
              >

                <div className="flex justify-between mb-2 items-center">

                  <span className="font-medium text-gray-700">

                    {file.name}

                  </span>

                  <div className="flex gap-3 items-center">

                    <span className="font-semibold">

                      {file.progress}%

                    </span>

                    {file.progress === 100 && (

                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">

                        Uploaded

                      </span>

                    )}

                  </div>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${file.progress}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold text-gray-800">

              Uploaded Documents

            </h2>

            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">

              {documents.length} Files

            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-gray-600">

                  <th className="text-left py-4">
                    File Name
                  </th>

                  <th className="text-left py-4">
                    Size
                  </th>

                  <th className="text-left py-4">
                    Uploaded At
                  </th>

                </tr>

              </thead>

              <tbody>

                {documents.map((doc, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-all"
                  >

                    <td className="py-4 font-medium text-gray-700">

                      {doc.name}

                    </td>

                    <td className="py-4">

                      {(doc.size / 1024).toFixed(2)} KB

                    </td>

                    <td className="py-4 text-gray-500">

                      {new Date(doc.date).toLocaleString()}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 mt-10">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold text-gray-800">

              Notifications

            </h2>

            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">

              {notifications.length} Alerts

            </span>

          </div>

          <div className="space-y-4">

            {notifications.length === 0 ? (

              <div className="text-center py-10 text-gray-400">

                No notifications yet

              </div>

            ) : (

              notifications.map((notification) => (

                <div
                  key={notification.id}
                  className="border border-blue-100 bg-blue-50 rounded-2xl p-5 hover:bg-blue-100 transition-all"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-semibold text-gray-700">

                        {notification.message}

                      </p>

                      <p className="text-sm text-gray-500 mt-1">

                        {new Date(
                          notification.timestamp
                        ).toLocaleString()}

                      </p>

                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">

                      Success

                    </span>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default App;