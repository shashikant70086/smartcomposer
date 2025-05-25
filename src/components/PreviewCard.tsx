import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/use-theme'; // Adjust the import path as needed

interface PreviewCardProps {
  message: string;
  // Add other props as needed, e.g., onEdit, onCopy, onSave
}

const PreviewCard: React.FC<PreviewCardProps> = ({ message }) => {
  const { theme } = useTheme(); // Assuming useTheme provides 'theme' state

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative p-6 rounded-xl shadow-lg transition-colors duration-300
        ${theme === 'dark' ? 'bg-gray-800/30 backdrop-filter backdrop-blur-lg border border-gray-700' : 'bg-white/30 backdrop-filter backdrop-blur-lg border border-gray-200'}
        hover:shadow-xl`}
    >
      {/* Hover effect - slight tilt example */}
      <motion.div className="h-full flex flex-col justify-between"
        whileHover={{ rotate: [0, -1, 1, 0], transition: { duration: 0.3 } }}
       >
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {message}
        </p>
        <div className="flex justify-end space-x-2">
          {/* Buttons will go here */}
          {/* Example Buttons (add functionality as props) */}
          <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200
             ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
            Edit
          </button>
          <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200
             ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
            Copy
          </button>
          <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200
             ${theme === 'dark' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}>
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviewCard;