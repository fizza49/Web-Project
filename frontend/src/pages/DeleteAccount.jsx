import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import axios from "../api";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.delete("/auth/delete", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      alert("Account deleted successfully");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || "Error deleting account. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-purple-900 flex items-center justify-center px-4 py-16">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 md:p-16 w-full max-w-lg text-center shadow-2xl">
        <AlertTriangle className="mx-auto mb-6 w-20 h-20 text-red-600" />
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
          Delete Account
        </h2>
        <p className="mb-10 text-gray-700 text-lg">
          This action is <span className="font-semibold">permanent</span> and cannot be undone.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className={`w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-colors text-lg font-semibold ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Delete Account
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md text-center shadow-xl">
            <AlertTriangle className="mx-auto mb-4 w-16 h-16 text-red-600" />
            <h3 className="text-2xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
