import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhotoIcon, MapPinIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useComplaints } from '../context/ComplaintContext';

const ComplaintPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const { addComplaint } = useComplaints();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleLocation = () => {
    // Mock GPS functionality
    setLocation('Gachibowli, Hyderabad, 500032');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && location) {
      const newId = addComplaint({
        description,
        location,
        imageUrl: preview || undefined,
      });
      setComplaintId(newId);
      setSubmitted(true);
    }
  };
  
  const handleNewComplaint = () => {
      setImage(null);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setLocation('');
      setDescription('');
      setSubmitted(false);
      setComplaintId('');
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center space-y-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto"/>
        <h2 className="text-2xl font-bold text-gray-800">Complaint Submitted!</h2>
        <p className="text-gray-600">Your complaint has been successfully registered. Thank you for your contribution.</p>
        <p className="font-semibold text-lg">Your Complaint ID: <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded">{complaintId}</span></p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button 
              onClick={handleNewComplaint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
              <ArrowPathIcon className="w-5 h-5" />
              File Another
          </button>
          <Link to="/status"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Track Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">File a New Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {preview ? (
                <img src={preview} alt="Preview" className="mx-auto h-48 w-auto rounded-md" />
              ) : (
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>{preview ? 'Change file' : 'Upload a file'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
                {!preview && <p className="pl-1">or drag and drop</p>}
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Enter address or use GPS" />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <button type="button" onClick={handleLocation} className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400 hover:bg-gray-100">
                        GPS
                    </button>
                </div>
            </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Comments</label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintPage;