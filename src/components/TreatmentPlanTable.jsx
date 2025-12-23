import { formatName } from "../utils/validations";

const TreatmentPlanTable = ({ rows, dateCols, onUpdate, onRemove, onAdd }) => {
  return (
    <section className="mb-6 print:mb-4">
      <div className="flex justify-between items-center mb-3 print:mb-1">
        <h2 className="text-lg font-bold uppercase text-blue-700 tracking-wide print:text-base">
          Treatment Plan
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:text-blue-800 hover:underline print:hidden transition-colors"
          aria-label="Add Medicine"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 5v14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span> Add Medicine</span>
        </button>
      </div>

      <table className="w-full border-collapse border-2 border-blue-300 text-sm print:text-xs print:border print:border-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white print:bg-gray-100 print:text-gray-900">
            <th className="border-2 border-blue-300 print:border print:border-gray-800 p-3 text-left font-semibold print:p-1 print:w-48">
              Medicine / Dose
            </th>
            {dateCols.map((date, i) => (
              <th
                key={i}
                className="border-2 border-blue-300 print:border print:border-gray-800 p-3 text-center font-semibold print:p-1 print:w-16"
              >
                {date}
              </th>
            ))}
            <th className="border border-gray-800 p-2 w-16 print:hidden">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id}
              className={
                idx % 2 === 0
                  ? "bg-white print:bg-white"
                  : "bg-blue-50 print:bg-white"
              }
            >
              {/* Medicine Inputs */}
              <td className="border-2 border-blue-300 print:border print:border-gray-800 p-3 print:p-1">
                {/* // Inside the Medicine Name input */}
                <input
                  type="text"
                  value={row.label ?? ""}
                  onChange={(e) =>
                    onUpdate(row.id, "label", formatName(e.target.value))
                  }
                  placeholder="Medicine Name"
                  className="w-full bg-transparent outline-none font-bold placeholder-gray-400 mb-1 print:mb-0.5 text-sm print:text-xs"
                />
                {/* // Inside the Dose input */}
                <input
                  type="text"
                  value={row.dose ?? ""}
                  onChange={(e) =>
                    onUpdate(row.id, "dose", e.target.value.toUpperCase())
                  }
                  placeholder="Dose (e.g. 2ML)"
                  className="w-full bg-transparent outline-none text-xs text-gray-600 placeholder-gray-400 print:text-xs"
                />
              </td>
              {/* Date Cells */}
              {dateCols.map((_, i) => (
                <td
                  key={i}
                  className="border-2 border-blue-300 print:border print:border-gray-800 p-0 h-12 print:h-10 relative"
                >
                  {/* Once/Twice Logic */}
                  {row.type === "Twice" ? (
                    <div className="h-full w-full relative">
                      <svg
                        className="absolute left-0 top-0 w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <line
                          x1="0"
                          y1="100"
                          x2="100"
                          y2="0"
                          stroke="#9CA3AF"
                          strokeWidth="2.5"
                          strokeDasharray="6"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-full w-full"></div>
                  )}
                </td>
              ))}
              {/* Actions */}
              <td className="border-2 border-blue-300 print:border print:border-gray-800 p-1.5 text-center print:p-0.5 print:text-center print:bg-gray-50 bg-blue-100 rounded-r-lg print:rounded-none print:hidden">
                <select
                  value={row.type}
                  onChange={(e) => onUpdate(row.id, "type", e.target.value)}
                  className="block w-full text-xs border border-blue-300 rounded mb-1 print:border print:border-gray-300 print:mb-0.5 bg-white font-medium"
                >
                  <option value="Once">1x</option>
                  <option value="Twice">2x</option>
                </select>
                <button
                  onClick={() => onRemove(row.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg leading-none print:text-sm"
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TreatmentPlanTable;
