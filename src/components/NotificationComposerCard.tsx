import React, { useState } from 'react';
import { useTheme } from '../hooks/use-theme';
import { motion } from 'framer-motion';

const NotificationComposerCard: React.FC = () => {
  const { theme } = useTheme();
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const tones = ['casual', 'friendly', 'formal', 'urgent'];
  const channels = ['Email', 'SMS', 'Push'];

  return (
    <div className={`p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg border ${theme === 'dark' ? 'bg-gray-800 bg-opacity-30 border-gray-700' : 'bg-white bg-opacity-30 border-gray-200'} font-sora`}>
      <div className="relative">
        <textarea
          id="prompt"
          className={`w-full p-3 pt-8 border rounded-md resize-none focus:outline-none peer ${theme === 'dark' ? 'bg-gray-700 bg-opacity-50 border-gray-600 text-white placeholder-transparent focus:border-blue-500' : 'bg-gray-100 bg-opacity-50 border-gray-300 text-gray-800 placeholder-transparent focus:border-blue-500'}`}
          placeholder=" "
          rows={4}
        />
        <label
          htmlFor="prompt"
          className={`absolute left-3 top-2 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm ${theme === 'dark' ? 'text-gray-400 peer-focus:text-blue-400' : 'text-gray-600 peer-focus:text-blue-600'}`}
        >
          Enter your prompt
        </label>
      </div>

      <div className="mt-6">
        <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tone</h3>
        <div className="flex space-x-2 mt-2">
          {tones.map((tone) => (
            <button
              key={tone}
              className={`px-4 py-2 rounded-full text-sm transition ${selectedTone === tone ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
              onClick={() => setSelectedTone(tone)}
            >
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Channels</h3>
        <div className="flex space-x-2 mt-2">
          {channels.map((channel) => {
            const isSelected = selectedChannels.includes(channel);
            return (
              <motion.button
                key={channel}
                className={`px-4 py-2 rounded-full text-sm transition relative overflow-hidden ${isSelected ? (theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white') : (theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
                onClick={() => setSelectedChannels(prev => isSelected ? prev.filter(c => c !== channel) : [...prev, channel])}
                whileTap={{ scale: 0.95 }}
              >
                {channel}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <motion.button
          className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 relative overflow-hidden group ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-600/50'
              : 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg hover:shadow-blue-600/50'
          }`}
          onClick={() => {
            // Handle generate logic here
            setIsGenerating(true);
            setTimeout(() => setIsGenerating(false), 1000); // Simulate loading
          }}
          whileTap={{ scale: 0.98 }}
          animate={isGenerating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: isGenerating ? Infinity : 0 }}
        >
          Generate
          {/* Glow effect */}
          <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-purple-500 to-transparent blur-md"></span>
          {/* Ripple effect on click (basic example, could be more complex) */}
          {isGenerating && <motion.span className="absolute inset-0 w-full h-full bg-white bg-opacity-20 rounded-full" initial={{ scale: 0 }} animate={{ scale: 1.5 }} exit={{ scale: 0 }} transition={{ duration: 1, repeat: Infinity }}></motion.span>}
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationComposerCard;