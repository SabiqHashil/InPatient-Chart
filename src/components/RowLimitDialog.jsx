/**
 * RowLimitDialog Component
 * ========================
 * Simplified clinical alert dialog for row limit notifications.
 *
 * Props:
 *   - isOpen (boolean): Whether the dialog is visible
 *   - tableType (string): 'Diet' or 'Treatment'
 *   - maxRows (number): The maximum number of rows allowed
 *   - onClose (function): Callback to close the dialog
 */

const RowLimitDialog = ({ isOpen, tableType = "Diet", maxRows = 7, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md print:hidden transition-all duration-300 p-3 sm:p-4">
      {/* Dialog Container - Simplified */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border-t-4 border-t-indigo-600 transform transition-all duration-300 opacity-100 scale-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {/* Title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Row Limit Alert
              </h2>
              <p className="text-indigo-100 text-xs">System capacity reached</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4">
          
          {/* Main Message */}
          <div>
            <p className="text-sm sm:text-base text-slate-800 font-semibold mb-2">
              {tableType} table has reached its limit
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Maximum capacity of <span className="inline-block bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                {maxRows} rows
              </span> on this page has been reached.
            </p>
          </div>

          {/* Information Note - A4 PDF Quality */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-900">
              <span className="font-semibold block mb-1">ℹ️ About this limit:</span>
              This limit is set to ensure optimal table fit and readability in <span className="font-semibold">A4 PDF format</span>. Maintaining this constraint guarantees better document quality and professional printing output.
            </p>
          </div>

        {/* Footer - Action Button */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3 sm:py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 sm:py-3 text-white font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg active:shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default RowLimitDialog;
