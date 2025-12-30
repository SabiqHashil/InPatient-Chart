/**
 * RowLimitDialog Component
 * ========================
 * Simplified clinical alert dialog for row limit and deletion warnings.
 *
 * Props:
 *   - isOpen (boolean): Whether the dialog is visible
 *   - tableType (string): 'Diet' or 'Treatment'
 *   - maxRows (number): The maximum number of rows allowed for this table
 *   - dietRowCount (number): Current count of diet rows
 *   - treatmentRowCount (number): Current count of treatment rows
 *   - maxTotalRows (number): Maximum total rows allowed (default: 11)
 *   - onClose (function): Callback to close the dialog
 *   - mode (string): 'limit' (default) | 'delete-warning'
 */

const RowLimitDialog = ({
  isOpen,
  tableType = "Diet",
  maxRows = 7,
  dietRowCount = 0,
  treatmentRowCount = 0,
  maxTotalRows = 11,
  onClose,
  mode = "limit",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md print:hidden transition-all duration-300 p-3 sm:p-4">
      {/* Dialog Container */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border-t-4 border-t-indigo-600 transform transition-all duration-300 opacity-100 scale-100 overflow-hidden">
        {/* Header Section - varies by mode */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-5 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {/* Title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {mode === "delete-warning"
                  ? "Deletion Warning"
                  : "Row Limit Alert"}
              </h2>
              <p className="text-indigo-100 text-xs">
                {mode === "delete-warning"
                  ? "Action blocked"
                  : "System capacity reached"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Main Message - differs when deletion warning */}
          <div>
            {mode === "delete-warning" ? (
              <>
                <p className="text-sm sm:text-base text-slate-800 font-semibold mb-2">
                  Cannot delete the last row
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  Each table must contain at least one row. Deletion is not
                  allowed when only a single row remains.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm sm:text-base text-slate-800 font-semibold mb-2">
                  {tableType} table has reached its limit
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  Maximum capacity of{" "}
                  <span className="inline-block bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
                    {maxRows} rows
                  </span>{" "}
                  on this page has been reached.
                </p>
              </>
            )}
          </div>

          {/* Information Note - A4 PDF Quality (only for limit mode) */}
          {mode === "limit" && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-900">
                <span className="font-semibold block mb-1">
                  ℹ️ About this limit:
                </span>
                This limit is set to ensure optimal table fit and readability in{" "}
                <span className="font-semibold">A4 PDF format</span>.
                Maintaining this constraint guarantees better document quality
                and professional printing output.
              </p>
            </div>
          )}

          {/* Current Row Count (only for limit mode) */}
          {mode === "limit" && (
            <div className="grid grid-cols-1 gap-2">
              <div className="text-xs text-slate-700">
                <span className="font-semibold">📊 Current Row Count:</span>
              </div>
              <div className="flex justify-between text-sm text-slate-800">
                <div>Diet rows:</div>
                <div className="font-semibold">{dietRowCount}</div>
              </div>
              <div className="flex justify-between text-sm text-slate-800">
                <div>Treatment rows:</div>
                <div className="font-semibold">{treatmentRowCount}</div>
              </div>
              <div className="flex justify-between text-sm text-slate-800">
                <div>Total:</div>
                <div className="font-semibold">
                  {dietRowCount + treatmentRowCount} / {maxTotalRows}
                </div>
              </div>
            </div>
          )}

          {/* Actions - single button for delete-warning or limit mode */}
          <div className="pt-2">
            <div className="flex justify-center">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "delete-warning"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
                onClick={onClose}
              >
                {mode === "delete-warning" ? "I Understand" : "Acknowledge"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowLimitDialog;
