
const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-neutral-900">Security Dashboard</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
        New Scan
      </button>
    </div>



    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Critical Issues */}
      <StatCard 
        title="Critical Issues" 
        count="7" 
        iconColor="text-red-600" 
        bgColor="bg-red-100" 
        svgPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
      {/* Warnings */}
      <StatCard 
        title="Warnings" 
        count="13" 
        iconColor="text-yellow-600" 
        bgColor="bg-yellow-100" 
        svgPath="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      {/* Scans Complete */}
      <StatCard 
        title="Scans Complete" 
        count="24" 
        iconColor="text-green-600" 
        bgColor="bg-green-100" 
        svgPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      {/* Security Score */}
      <StatCard 
        title="Security Score" 
        count="76%" 
        iconColor="text-blue-600" 
        bgColor="bg-blue-100" 
        svgPath="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
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
  

export default DashboardPage;

  //C:\Users\reall\OneDrive\Desktop\Projexts\Threat Hawk VDS\frontend\src\app\dashboard\page.tsx