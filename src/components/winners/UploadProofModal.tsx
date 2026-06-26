import { useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

interface UploadProofModalProps {
  drawResultId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadProofModal({ drawResultId, onClose, onSuccess }: UploadProofModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('proof', file);
    formData.append('drawResultId', drawResultId);

    try {
      await api.post('/winners/upload-proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Proof uploaded successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Upload Winning Proof</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Screenshot Proof</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              {file ? (
                <div className="text-green-400 font-semibold">{file.name}</div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <div className="text-sm text-gray-400">Click to upload or drag and drop</div>
                  <div className="text-[10px] text-gray-500 mt-1">PNG, JPG up to 5MB</div>
                </>
              )}
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex gap-3 text-orange-400 text-xs">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>Your screenshot must clearly show your official golf club scores matching the drawn numbers.</p>
          </div>

          <button 
            type="submit"
            disabled={!file || uploading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Uploading...
              </>
            ) : 'Submit Proof'}
          </button>
        </form>
      </div>
    </div>
  );
}
