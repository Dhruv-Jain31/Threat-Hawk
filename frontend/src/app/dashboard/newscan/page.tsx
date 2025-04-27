import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Security Dashboard</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          New Scan
        </button>
      </div>



   


 {/* Quick Scan Form */}
 <div className="bg-white rounded-lg border border-neutral-200/30 p-6">
  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Scan Options</h2>
  <form className="space-y-4">
    <div>
      <label htmlFor="url" className="block text-sm font-medium text-neutral-700">
        Website URL
      </label>
      <div className="mt-1 flex rounded-md shadow-lg">
        <input 
          type="url" 
          id="url" 
          placeholder="https://upes.beta.ac.in" 
          className="flex-1 block w-full text-lg px-3 py-6 rounded-md border border-neutral-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>

    <div className="flex space-x-4">
      <div className="w-full">
        <label htmlFor="scan-type" className="block text-sm font-medium text-neutral-700">
          Scan Type
        </label>
        <select 
          id="scan-type" 
          className="block w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="network">Network Scan</option>
          <option value="owasp">OWASP Scan</option>
          <option value="boht">Network + OWASP</option>
        </select>
      </div>

      <div className="w-full">
        <label htmlFor="scan-depth" className="block text-sm font-medium text-neutral-700">
          Scan Depth
        </label>
        <select 
          id="scan-depth" 
          className="block w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="quick">Quick Scan</option>
          <option value="deep">Deep Scan</option>
        </select>
      </div>
    </div>

    <div className="flex justify-end">
      <button 
        type="submit" 
        className="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Start Scan
      </button>
    </div>
  </form>
</div>



      {/* Recent Scans */}
      <div className="bg-white rounded-lg border border-neutral-200/30 mb-8">
        <div className="px-6 py-4 border-b border-neutral-200/30">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Scans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                {["Website", "Status", "Issues", "Date", "Actions"].map((heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/30">
              <ScanRow 
                website="example.com" 
                status="Complete" 
                issues="3 Critical, 5 Warning" 
                date="2024-01-20"
                action="View Report"
                statusColor="bg-green-100 text-green-800"
              />
              <ScanRow 
                website="test-site.org" 
                status="In Progress" 
                issues="Scanning..." 
                date="2024-01-19"
                action="Cancel"
                statusColor="bg-yellow-100 text-yellow-800"
              />
            </tbody>
          </table>
        </div>
      </div>

     
    </div>
  );
};

const StatCard = ({ title, count, iconColor, bgColor, svgPath } : any) => (
  <div className="bg-white p-6 rounded-lg border border-neutral-200/30">
    <div className="flex items-center">
      <div className={`rounded-full p-3 ${bgColor}`}>
        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={svgPath} />
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-sm text-neutral-600">{title}</p>
        <h3 className="text-xl font-bold text-neutral-900">{count}</h3>
      </div>
    </div>
  </div>
);

const ScanRow = ({ website, status, issues, date, action, statusColor }: any) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">{website}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">{issues}</td>
    <td className="px-6 py-4 whitespace-nowrap">{date}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button className="text-indigo-600 hover:text-indigo-900">{action}</button>
    </td>
  </tr>
);

export default Dashboard;
