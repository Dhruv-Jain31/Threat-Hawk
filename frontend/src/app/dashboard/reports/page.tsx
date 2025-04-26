import React from 'react';

const SecurityReports = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Security Reports</h1>
          <div className="flex space-x-4">
            <button className="flex items-center px-4 py-2 border border-neutral-200/30 rounded-lg hover:bg-white">
              <svg className="w-5 h-5 mr-2 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Reports
            </button>
          </div>
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200/30 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date Range</label>
            <select className="w-full px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Website</label>
            <select className="w-full px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All websites</option>
              <option>example.com</option>
              <option>test-site.org</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Severity</label>
            <select className="w-full px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All severities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select className="w-full px-4 py-2 rounded-lg border border-neutral-200/30 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>All statuses</option>
              <option>Open</option>
              <option>Fixed</option>
              <option>In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg border border-neutral-200/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Report ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Website</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Scan Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Issues Found</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/30">
              <tr className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">#REP-2024-001</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">E</span>
                    </div>
                    <span className="ml-3">example.com</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">Jan 20, 2024</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">3 Critical</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">5 High</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">High Risk</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Download PDF</button>
                  </div>
                </td>
              </tr>
              {/* Additional report entries */}
              <tr className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">#REP-2024-002</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium">T</span>
                    </div>
                    <span className="ml-3">test-site.org</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">Jan 19, 2024</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">2 Medium</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">3 Low</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium Risk</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Download PDF</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityReports;
