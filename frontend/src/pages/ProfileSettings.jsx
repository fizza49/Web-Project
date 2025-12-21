import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfileSettings = () => {
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("Session expired. Please login again.");

        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err.response || err);
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // Password strength calculation
  const getPasswordStrength = () => {
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
    return strength;
  };
  const strength = getPasswordStrength();

  // Handle form submission
  const { updateProfile } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword && !currentPassword) {
      setError("Please enter your current password");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        ...(newPassword && { currentPassword, newPassword }),
      };

      const updatedUser = await updateProfile(payload);

      setMessage("Profile updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      console.log("Updated user:", updatedUser);
    } catch (err) {
      console.error(err);
      setMessage(null);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-purple-900 px-6 flex items-center justify-center">
      <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-10 text-center">
          Profile & Security
        </h1>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 space-y-6 md:space-y-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Account Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="text-blue-600" />
              Account Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="p-4 rounded-xl border"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="p-4 rounded-xl border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="text-red-600" />
              Change Password
            </h2>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-4 rounded-xl border"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full p-4 rounded-xl border"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />

              {/* Password strength */}
              {newPassword && (
                <>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strength <= 1
                          ? "bg-red-500 w-1/4"
                          : strength === 2
                          ? "bg-yellow-500 w-2/4"
                          : strength === 3
                          ? "bg-blue-500 w-3/4"
                          : "bg-green-500 w-full"
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Password strength:{" "}
                    {
                      ["Very Weak", "Weak", "Good", "Strong", "Very Strong"][
                        strength
                      ]
                    }
                  </p>
                </>
              )}

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-4 rounded-xl border"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Messages */}
          {error && <p className="text-red-600 font-medium">{error}</p>}
          {message && <p className="text-green-600 font-medium">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:opacity-90 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
