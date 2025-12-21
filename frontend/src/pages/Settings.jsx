import React from "react";
import { Link } from "react-router-dom";
import { User, Trash2, LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-purple-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl">

        {/* Page Header */}
        <div className="mb-12 text-center px-2 md:px-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Account Settings
          </h1>
          <p className="text-gray-200 text-base md:text-lg">
            Manage your profile, security, and account preferences
          </p>
        </div>

        {/* Settings Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-12 space-y-6">

          {/* Profile */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link
              to="/settings/profile"
              className="group flex items-center justify-between p-6 md:p-8 rounded-3xl border hover:bg-blue-50 hover:shadow-lg transition-all duration-300 w-full"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 md:p-5 bg-blue-100 rounded-xl text-blue-600">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    Profile Settings
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">
                    Update your personal information and preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Delete Account */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link
              to="/settings/delete-account"
              className="group flex items-center justify-between p-6 md:p-8 rounded-3xl border hover:bg-red-50 hover:shadow-lg transition-all duration-300 w-full"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 md:p-5 bg-red-100 rounded-xl text-red-600">
                  <Trash2 size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    Delete Account
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">
                    Permanently remove your account and data
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Logout */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link
              to="/logout"
              className="group flex items-center justify-between p-6 md:p-8 rounded-3xl border hover:bg-gray-100 hover:shadow-lg transition-all duration-300 w-full"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 md:p-5 bg-gray-200 rounded-xl text-gray-700">
                  <LogOut size={32} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    Logout
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">
                    Sign out from your account safely
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
