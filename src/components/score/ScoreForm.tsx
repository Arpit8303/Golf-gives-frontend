import { useState } from 'react';
import { useScoreStore } from '../../store/scoreStore';

export default function ScoreForm() {
  const [score, setScore] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Default to today (YYYY-MM-DD)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addScore } = useScoreStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !entryDate) return;

    const numScore = parseInt(score, 10);
    if (numScore < 1 || numScore > 45) {
      alert('Score must be between 1 and 45.');
      return;
    }

    setIsSubmitting(true);
    await addScore(numScore, entryDate);
    setIsSubmitting(false);
    setScore('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="input-label" htmlFor="score">
          Score (1-45)
        </label>
        <input
          id="score"
          type="number"
          min="1"
          max="45"
          required
          className="input-field"
          placeholder="e.g. 36"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>

      <div className="flex-1">
        <label className="input-label" htmlFor="entryDate">
          Date
        </label>
        <input
          id="entryDate"
          type="date"
          required
          className="input-field"
          value={entryDate}
          max={new Date().toISOString().split('T')[0]} // Cannot enter future dates
          onChange={(e) => setEntryDate(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Adding...' : 'Add Score'}
      </button>
    </form>
  );
}
