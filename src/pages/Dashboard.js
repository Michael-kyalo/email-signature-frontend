import React, { useEffect, useState } from "react";
import SignatureList from "../components/Dashboard/SignatureList";
import CreateSignatureModal from "../components/Dashboard/CreateSignatureModal";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const [analyticsCount, setAnalyticsCount] = useState(0);
  const [signaturesCount, setSignaturesCount] = useState(0);
  const [linksCount, setLinksCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchCounts = async () => {
    try {
      setLoading(true);

      // Fetch analytics count
      const analyticsResponse = await axiosInstance.get("/analytics/count");
      setAnalyticsCount(analyticsResponse.data.count);

      // Fetch signatures count
      const signaturesResponse = await axiosInstance.get("/signatures/count");
      setSignaturesCount(signaturesResponse.data.count);

      // Fetch links count
      const linksResponse = await axiosInstance.get("/links/count");
      setLinksCount(linksResponse.data.count);

      setError(""); // Clear errors
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white p-6 rounded shadow-lg mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello there!</h1>
          <p className="text-gray-600">Here’s a summary of your account:</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create Signature
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-blue-600">
            {loading ? "..." : analyticsCount}
          </h2>
          <p className="text-gray-600">Analytics Entries</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-green-600">
            {loading ? "..." : signaturesCount}
          </h2>
          <p className="text-gray-600">Signatures</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-yellow-600">
            {loading ? "..." : linksCount}
          </h2>
          <p className="text-gray-600">Links</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Signature List Section */}
      <div className="bg-white p-6 rounded shadow-lg mb-6">
        <SignatureList />
      </div>

      {/* Modal for Creating Signature */}
      {isModalOpen && <CreateSignatureModal onClose={toggleModal} />}
    </div>
  );
};

export default Dashboard;
