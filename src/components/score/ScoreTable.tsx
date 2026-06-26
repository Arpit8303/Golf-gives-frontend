import { useState } from 'react';
import { useScoreStore } from '../../store/scoreStore';

export default function ScoreTable() {
  const { scores, isLoading, updateScore, deleteScore } = useScoreStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');

  const startEdit = (score: any) => {
    setEditingId(score.id);
    setEditScore(score.score.toString());
    setEditDate(score.entry_date.split('T')[0]);
  };

  const handleUpdate = async () => {
    if (!editingId || !editScore || !editDate) return;
    const numScore = parseInt(editScore, 10);
    
    await updateScore(editingId, { score: numScore, entry_date: editDate });
    setEditingId(null);
  };

  if (isLoading && scores.length === 0) {
    return <div className="skeleton h-32 w-full"></div>;
  }

  if (scores.length === 0) {
    return (
      <div className="py-8 text-center text-text-muted">
        <p>No scores added yet. Add your first score above!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {scores.length === 5 && (
        <div className="mb-4 rounded-md bg-warning/10 p-3 text-sm text-warning border border-warning/20">
          <strong>Note:</strong> You have 5 scores. Adding a new one will replace your oldest score.
        </div>
      )}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="pb-3 font-semibold">Date</th>
            <th className="pb-3 font-semibold">Score</th>
            <th className="pb-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score.id} className="border-b border-border/50 transition-colors hover:bg-surface">
              <td className="py-4 pl-2">
                {editingId === score.id ? (
                  <input
                    type="date"
                    className="input-field py-1 text-sm"
                    value={editDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                ) : (
                  new Date(score.entry_date).toLocaleDateString()
                )}
              </td>
              <td className="py-4">
                {editingId === score.id ? (
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="input-field w-20 py-1 text-sm"
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                  />
                ) : (
                  <span className="font-display text-lg font-bold text-accent-green">
                    {score.score}
                  </span>
                )}
              </td>
              <td className="py-4 text-right pr-2">
                {editingId === score.id ? (
                  <div className="flex justify-end gap-2">
                    <button onClick={handleUpdate} className="text-accent-green hover:underline">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-text-muted hover:underline">Cancel</button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-3">
                    <button onClick={() => startEdit(score)} className="text-text-muted hover:text-white">
                      Edit
                    </button>
                    <button onClick={() => deleteScore(score.id)} className="text-error hover:underline">
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
