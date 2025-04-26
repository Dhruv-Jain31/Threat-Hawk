import React from "react";

const ScanHistory: React.FC = () => {
  return (
    <div id="scanhistory" className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Scan History</h1>
          <div className="flex space-x-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search scans..."
                className="w-64 px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter Select */}
            <div className="relative">
              <select
                className="appearance-none w-48 px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>All Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="bg-white rounded-lg border border-neutral-200/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                {["Website", "Scan Date", "Duration", "Status", "Findings", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/30">
              {/* Row 1 */}
              <ScanHistoryRow
                siteName="futics.com"
                scanDate="2024-01-20 14:30"
                duration="15m 32s"
                status="Completed"
                findings={{ critical: 3, medium: 5, low: 2 }}
                avatarBg="bg-indigo-100"
                avatarTextColor="text-indigo-600"
                avatarLetter="E"
              />

              {/* Row 2 */}
              <ScanHistoryRow
                siteName="onlyfans.org"
                scanDate="2024-01-19 09:15"
                duration="12m 45s"
                status="Completed"
                findings={{ critical: 1, medium: 3, low: 4 }}
                avatarBg="bg-green-100"
                avatarTextColor="text-green-600"
                avatarLetter="T"
              />
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
              <span className="font-medium">45</span> results
            </div>
            <div className="flex space-x-2">
              <PaginationButton label="Previous" />
              <PaginationButton label="1" active />
              <PaginationButton label="2" />
              <PaginationButton label="3" />
              <PaginationButton label="Next" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponents

interface ScanHistoryRowProps {
  siteName: string;
  scanDate: string;
  duration: string;
  status: string;
  findings: {
    critical: number;
    medium: number;
    low: number;
  };
  avatarBg: string;
  avatarTextColor: string;
  avatarLetter: string;
}

const ScanHistoryRow: React.FC<ScanHistoryRowProps> = ({
  siteName,
  scanDate,
  duration,
  status,
  findings,
  avatarBg,
  avatarTextColor,
  avatarLetter,
}) => {
  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center`}>
            <span className={`${avatarTextColor} font-medium`}>{avatarLetter}</span>
          </div>
          <span className="ml-3">{siteName}</span>
        </div>
      </td>
      <td className="px-6 py-4">{scanDate}</td>
      <td className="px-6 py-4">{duration}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          {findings.critical > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
              {findings.critical} Critical
            </span>
          )}
          {findings.medium > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
              {findings.medium} Medium
            </span>
          )}
          {findings.low > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {findings.low} Low
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-3">
          <button className="text-indigo-600 hover:text-indigo-900">View Report</button>
          <button className="text-neutral-600 hover:text-neutral-900">Download PDF</button>
        </div>
      </td>
    </tr>
  );
};

interface PaginationButtonProps {
  label: string;
  active?: boolean;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({ label, active = false }) => {
  return (
    <button
      className={`px-3 py-1 border border-neutral-200/30 rounded-md text-sm text-neutral-700 ${
        active ? "bg-neutral-50" : "hover:bg-neutral-50"
      }`}
    >
      {label}
    </button>
  );
};

export default ScanHistory;
