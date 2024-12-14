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
        <table className="min-w-full border-collapse border border-gray-200">
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
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Preview
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                      Export
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
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
