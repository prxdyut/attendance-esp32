import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { handleFetch } from '../../utils/handleFetch';

export function ViewSingleScore() {
    const [score, setScore] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        handleFetch(`/scores/${id}`, setLoading, setScore, console.error);
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!score) return <div>Score not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{score.title}</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <strong className="block text-gray-700 text-sm font-bold mb-2">Date:</strong>
                    {new Date(score.date).toLocaleDateString()}
                </div>
                <div className="mb-4">
                    <strong className="block text-gray-700 text-sm font-bold mb-2">Subject:</strong>
                    {score.subject}
                </div>
                <div className="mb-4">
                    <strong className="block text-gray-700 text-sm font-bold mb-2">Total Marks:</strong>
                    {score.total}
                </div>
                <div className="mb-4">
                    <strong className="block text-gray-700 text-sm font-bold mb-2">Batch:</strong>
                    {score.batchIds?.map((batch: any) => batch.name).join(', ')}
                </div>
                <div className="mb-4">
                    <strong className="block text-gray-700 text-sm font-bold mb-2">Student Scores:</strong>
                    <ul>
                        {score.obtained.map((item: any) => (
                            <li key={item.studentId}>
                                {item.studentId.name}: {item.marks} marks
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Link to={`/scores/${id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</Link>
            <Link to="/scores" className="bg-gray-500 text-white px-4 py-2 rounded">Back to All Scores</Link>
        </div>
    );
}