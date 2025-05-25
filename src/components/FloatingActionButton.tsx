import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/use-theme'; // Adjust the import path as needed

const FloatingActionButton: React.FC = () => {
  const { theme } = useTheme();
  const [useMic, setUseMic] = React.useState(false); // State to toggle between icons

  const handleOpenModal = () => {
    // Placeholder for modal opening logic
    console.log('FAB clicked, opening modal...');
    // You would typically open a modal here, e.g., by updating a state variable
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg focus:outline-none transition-colors duration-200
        ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600 text-white'}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleOpenModal}
    >
      {useMic ? (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="currentColor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <path d="M8.707 19.707c-.092.092-.202.167-.323.226-.12.058-.25.097-.385.114-.136.017-.275.017-.412 0-.136-.017-.266-.056-.385-.114a.822.822 0 01-.323-.226l-6-6a.831.831 0 010-1.172l6-6c.092-.092.202.167-.323-.226.12-.058.25-.097.385-.114.136-.017.275-.017.412 0 .136.017.266.056.385-.114.12.059.231.134.323.226l6 6a.831.831 0 010 1.172l-6 6z" />
        </motion.svg>
      ) : (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </motion.svg>
      )}
      {/* You can add a button or logic to toggle 'useMic' for demonstrating */}
      {/* <button onClick={() => setUseMic(!useMic)} className="ml-2 text-sm">Toggle Icon</button> */}

    </motion.button>
  );
};

export default FloatingActionButton;
