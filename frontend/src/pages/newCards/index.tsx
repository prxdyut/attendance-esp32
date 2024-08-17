import React, { useState, useEffect } from 'react';
import { handleFetch } from '../../utils/handleFetch';
import { Search } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function NewCards() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ newCards: [] });
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  console.log({ data })
  useEffect(() => {
    handleFetch(`/punches/new?startDate=${startDate}&endDate=${endDate}`, setLoading, setData, console.error);
  }, [startDate, endDate]);

  const filteredCards = data.newCards.filter((card: any) =>
    card.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(card.timestamp), "do MMMM yyyy 'at' hh:mm a").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">New Cards</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
          </div>

          <div className="relative flex-grow mb-4">
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search new cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        )}

        {filteredCards.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">New Cards</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">UID</th>
                    <th className="py-2 px-4 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map((card: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{card.uid}</td>
                      <td className="py-2 px-4">{format(new Date(card.timestamp), "do MMMM yyyy 'at' hh:mm a")}</td>
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