import React, { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface ExportButtonsProps {
  type: 'vehicles' | 'drivers' | 'maintenance' | 'fuel' | 'trips';
  label?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ type, label }) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setShowMenu(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/export/${type}/${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${type}_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export des données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cipme-green to-cipme-green-dark text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
        {loading ? 'Export...' : label || 'Exporter'}
      </button>

      {showMenu && !loading && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
            {(type === 'vehicles' || type === 'drivers') && (
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-gray-700 font-medium"
              >
                <DocumentArrowDownIcon className="w-5 h-5 mr-2 text-red-600" />
                Exporter en PDF
              </button>
            )}
            <button
              onClick={() => handleExport('excel')}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-gray-700 font-medium border-t border-gray-100"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2 text-green-600" />
              Exporter en Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButtons;
