import React, { useState, useEffect } from 'react';
import { handleFetch } from '../../utils/handleFetch';
import { Search } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { TargetSelector } from '../../components/SelectTarget';

function AttendanceBase({ type }: { type: string }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ presentees: [], absentees: [] });
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionType, setSelectionType] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  console.log(data)
  useEffect(() => {
    const endpoint = type === 'absentees' ? '/statistics/absentees' : '/statistics/presentees';
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      selectionType,
      selectedIds: selectedIds.join(','),
    });

    handleFetch(
      `${endpoint}?${queryParams}`,
      setLoading,
      (newData: any) => setData(data => ({ ...data, ...newData })),
      console.error
    );
  }, [type, startDate, endDate, selectionType, selectedIds]);
  const handleSelectionChange = (newType, newIds) => {
    setSelectionType(newType);
    setSelectedIds(newIds);
  };

  const filteredData = (type === 'absentees' ? data.absentees : data.presentees).filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(data, type, filteredData)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {type === 'absentees' ? 'Absentees' : 'Presentees'} Data
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative flex-grow mb-4">
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <TargetSelector
              onSelectionChange={handleSelectionChange}
              label="Select Target..."
            />
          </div>

        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              {type === 'absentees' ? 'Absentees' : 'Presentees'}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    {type === 'presentees' && <th className="py-2 px-4 text-left">Punch Time</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{format(new Date(item.date), 'do MMMM yyyy')}</td>
                      {type === 'presentees' && (
                        <td className="py-2 px-4">
                          {format(new Date(item.punchTime), 'hh:mm a')}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Absentees() {
  return <AttendanceBase type="absentees" />;
}

export function Presentees() {
  return <AttendanceBase type="presentees" />;
}