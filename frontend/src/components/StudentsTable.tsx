import { Edit, Eye, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentsTable({ students }: { students: any[] }) {
    return (
        <div>{students.length > 0 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <p className=" text-lg font-semibold p-4">
                    Students
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map((student: any, index: number) => (
                                <tr key={student._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link to={`/students/${student._id}`} className="text-blue-600 hover:text-blue-900">
                                                <Eye size={18} />
                                            </Link>
                                            <Link to={`/students/${student._id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                                                <Edit size={18} />
                                            </Link>
                                            <Link to={`/students/${student._id}/delete`} className="text-red-600 hover:text-red-900">
                                                <Trash2 size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}</div>
    )
}
