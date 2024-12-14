import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const SignatureList = () => {
  const [signatures, setSignatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/signatures");
        setSignatures(response.data.signatures);
        setError(""); // Clear errors
      } catch (err) {
        setError("Failed to load signatures.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignatures();
  }, []);

  const handlePreview = async (signatureId) => {
    try {
      const response = await axiosInstance.get(`/signature/${signatureId}/preview`);
      const previewHtml = response.data.html;

      // Open the preview in a new tab
      const previewWindow = window.open("", "_blank");
      previewWindow.document.write(previewHtml);
      previewWindow.document.close();
    } catch (err) {
      alert("Failed to load preview.");
    }
  };

  const handleExport = async (signatureId) => {
    try {
      const response = await axiosInstance.get(`/signature/${signatureId}/export`, {
        responseType: "blob",
      });

      // Trigger download
      const blob = new Blob([response.data], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `signature_${signatureId}.html`;
      link.click();
    } catch (err) {
      alert("Failed to export signature.");
    }
  };

  const handleDelete = async (signatureId) => {
    if (!window.confirm("Are you sure you want to delete this signature?")) return;

    try {
      await axiosInstance.delete(`/signature/${signatureId}`);
      setSignatures((prev) => prev.filter((signature) => signature.id !== signatureId));
      alert("Signature deleted successfully.");
    } catch (err) {
      alert("Failed to delete signature.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Signatures</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading signatures...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : signatures.length === 0 ? (
        <p className="text-gray-600">You have no signatures yet. Create one to get started!</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200 shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {signatures.map((signature) => (
              <tr key={signature.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700 border-b">
                  {signature.template_data?.name || "Unnamed Signature"}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">
                  {new Date(signature.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handlePreview(signature.id)}
                    >
                      Preview
                    </button>
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleExport(signature.id)}
                    >
                      Export
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(signature.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SignatureList;
