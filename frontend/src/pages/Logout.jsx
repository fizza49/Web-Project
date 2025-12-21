import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1000); // optional delay to show message
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
      <p className="text-2xl font-semibold text-gray-900">Logging out...</p>
    </div>
  );
};

export default Logout;
