// components/LectureScheduler.js
import React, { useState, useEffect } from 'react';
import { handleFetch } from '../../utils/handleFetch';
import { format, parseISO } from 'date-fns';
import { TargetSelector } from '../../components/SelectTarget';
import { handleSubmit } from '../../utils/handleSubmit';
import { Link } from 'react-router-dom';
import { Delete, Edit, Plus, Search } from 'lucide-react';

export function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchSchedules();
    }, [startDate, endDate, selectedBatch]);

    const fetchSchedules = () => {
        const queryParams = new URLSearchParams({
            startDate,
            endDate,
        });
        if (selectedBatch) queryParams.set('batchId', selectedBatch)

        handleFetch(
            `/schedules?${queryParams}`,
            setLoading,
            (data) => {
                setSchedules(data)
            },
            (error) => {
                console.error('Error fetching schedules:', error);
                setSchedules([]);
            }
        );
    };

    console.log(schedules)

    const filteredSchedule = schedules.filter((sched) =>
        (format(parseISO(sched.date), 'dd MMM yyyy') + ' ' + sched.subject + ' ' + sched.batchId?.name + ' ' + sched.scheduledBy.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Lecture Scheduler</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
                        <div className="relative flex-grow mb-4 md:mb-0 md:mr-4">
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search useres..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        <Link
                            to="/schedules/new"
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            <Plus size={20} className="mr-2" />
                            Create Schedule
                        </Link>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">View Schedules</h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                        <TargetSelector
                            onSelectionChange={(type, ids) => setSelectedBatch(ids[0])}
                            label="Select Batch"
                            selectOnly="batchIds"
                            single={true}
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading schedules...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Date</th>
                                        <th className="py-2 px-4 text-left">Batch</th>
                                        <th className="py-2 px-4 text-left">Subject</th>
                                        <th className="py-2 px-4 text-left">Start Time</th>
                                        <th className="py-2 px-4 text-left">End Time</th>
                                        <th className="py-2 px-4 text-left">Scheduled By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchedule.map((schedule) => (
                                        <tr key={schedule._id} className="border-b">
                                            <td className="py-2 px-4">{format(parseISO(schedule.date), 'dd MMM yyyy')}</td>
                                            <td className="py-2 px-4">{schedule.batchIds?.name}</td>
                                            <td className="py-2 px-4">{schedule.subject}</td>
                                            <td className="py-2 px-4">{schedule.startTime}</td>
                                            <td className="py-2 px-4">{schedule.endTime}</td>
                                            <td className="py-2 px-4">{schedule.scheduledBy.name}</td>
                                            <td className="py-2 px-4">
                                                <Link to={'/schedules/' + schedule._id + '/edit'}>
                                                    <Edit />
                                                </Link>
                                                <Link to={'/schedules/' + schedule._id + '/delete'}>
                                                    <Delete />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}