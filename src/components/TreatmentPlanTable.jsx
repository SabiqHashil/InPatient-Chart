import React from "react";
import { formatName } from "../utils/validations";

const TreatmentPlanTable = ({
  rows,
  dateCols,
  onUpdate,
  onRemove,
  onAdd,
  showAddButton,
}) => {
  return (
    <section className="mb-6 print:mb-4">
      {/* Header Section: 
        - 2 columns on mobile/tablet (title left, button right)
        - 3 columns on large screens to align with the AdmissionForm sections
      */}
      <div className="grid grid-cols-2 lg:grid-cols-3 items-center mb-3 gap-3 print:flex print:justify-between print:mb-1">
        <h2 className="text-base sm:text-lg font-bold uppercase text-blue-700 tracking-wide print:text-base col-span-1">
          Treatment Plan
        </h2>

        {/* Spacer for 3-column alignment on Large screens */}
        <div className="hidden lg:block"></div>

        <div className="flex justify-end col-span-1">
          {showAddButton && (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold hover:bg-blue-700 print:hidden transition-all shadow-sm"
              aria-label="Add Medicine"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Add Medicine</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table Wrapper:
        - -mx-4 pulls the table to the screen edges on mobile
        - overflow-x-auto allows side-scrolling without breaking the page width
      */}
      <div className="overflow-x-auto print:overflow-visible print:w-full">
        <table className="min-w-full w-full border-collapse border-2 border-blue-300 text-sm print:text-[10px] print:border print:border-gray-800 print:table-fixed">
          <thead>
            <tr className="bg-blue-600 text-white print:bg-gray-100 print:text-gray-900">
              <th className="border-2 border-blue-300 print:border print:border-gray-800 p-1 sm:p-1 text-left font-semibold w-28 sm:w-32">
                Medicine / Dose
              </th>
              {dateCols.map((date, i) => (
                <th
                  key={i}
                  className="border-2 border-blue-300 print:border print:border-gray-800 p-1 text-center font-bold text-[10px] sm:text-xs"
                >
                  {date}
                </th>
              ))}
              <th className="border-2 border-blue-300 p-2 w-20 print:hidden">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-blue-50/50"}
              >
                {/* Medicine Name and Dose */}
                <td className="border-2 border-blue-300 print:border print:border-gray-800 p-1 sm:p-2 print:py-1">
                  <div className="flex flex-col gap-1">
                    {/* Medicine Name */}
                    <input
                      type="text"
                      value={row.label ?? ""}
                      onChange={(e) =>
                        onUpdate(row.id, "label", formatName(e.target.value))
                      }
                      className="w-full bg-transparent outline-none font-bold text-blue-900 placeholder-blue-300 text-xs sm:text-sm"
                      placeholder="e.g. Paracetamol"
                    />

                    {/* Dose (optional field below name) */}
                    <input
                      type="text"
                      value={row.dose ?? ""}
                      onChange={(e) =>
                        onUpdate(row.id, "dose", e.target.value.toUpperCase())
                      }
                      className="w-full bg-transparent outline-none text-[10px] sm:text-xs text-blue-500 font-medium placeholder-gray-400"
                      placeholder="e.g. 500mg"
                    />
                  </div>
                </td>

                {/* Date Cells with Visual Split */}
                {dateCols.map((_, i) => (
                  <td
                    key={i}
                    className="border-2 border-blue-300 print:border print:border-gray-800 p-0 h-10 sm:h-12 print:h-auto print:min-h-7 relative"
                  >
                    {row.type === "Twice" && (
                      <div className="h-full w-full absolute inset-0 pointer-events-none">
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <line
                            x1="0"
                            y1="100"
                            x2="100"
                            y2="0"
                            stroke="#93C5FD"
                            strokeWidth="1.5"
                            strokeDasharray="4"
                          />
                        </svg>
                      </div>
                    )}
                  </td>
                ))}

                {/* Actions Column */}
                <td className="border-2 border-blue-300 p-1 text-center bg-blue-50 print:hidden">
                  <div className="flex flex-col gap-1 items-center">
                    <select
                      value={row.type}
                      onChange={(e) => onUpdate(row.id, "type", e.target.value)}
                      className="text-[10px] border border-blue-300 rounded bg-white px-1 h-6 outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Once">1x</option>
                      <option value="Twice">2x</option>
                    </select>
                    <button
                      onClick={() => onRemove(row.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remove row"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-Only Hint */}
      <div className="mt-2 text-[10px] text-gray-400 sm:hidden italic">
        Swipe left/right to view all dates
      </div>
    </section>
  );
};

export default TreatmentPlanTable;
