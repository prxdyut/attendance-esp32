// components/AlertCreator.tsx

import React, { useState } from 'react';
import { TargetSelector } from '../../components/SelectTarget';
import { handleSubmit } from '../../utils/handleSubmit';

export const AlertCreator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'userIds' | 'batchIds'>('all');
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    handleSubmit(e, '/alerts', setLoading, console.log, console.error);
  };

  const onSelectionChange = (type: string, ids: string[]) => {
    setTargetType(type as 'all' | 'userIds' | 'batchIds');
    setTargetIds(ids);
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
      <label>Title:</label>
      <input
        className="border"
        type="text"
        name='title'
        required
      />
      <label>Message:</label>
      <textarea
        className="border"
        name='message'
        required
      />
      <label>Target:</label>
      <TargetSelector onSelectionChange={onSelectionChange} />
      <button
        type="submit"
        className="col-span-2 mt-4 p-2 bg-blue-500 text-white"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Alert'}
      </button>
    </form>
  );
};