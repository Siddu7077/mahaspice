import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit } from 'lucide-react';

const CPTypesDisplay = () => {
    const [cpTypes, setCpTypes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch CP Types
    useEffect(() => {
        fetchCPTypes();
    }, []);

    const fetchCPTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost/ms3/cptypes.php');
            setCpTypes(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch CP Types. Please try again.');
            console.error('Error fetching CP Types:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete CP Type
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            // Use the delete method with the correct endpoint
            await axios.delete('http://localhost/ms3/cptypes.php', { 
                data: { id: deleteId } 
            });
            
            // Optimistically remove from state
            setCpTypes(prev => prev.filter(cpType => cpType.id !== deleteId));
            setDeleteId(null);
            setIsDeleteDialogOpen(false);
        } catch (err) {
            setError('Failed to delete CP Type. Please try again.');
            console.error('Error deleting CP Type:', err);
            // Restore the previous state if deletion fails
            fetchCPTypes();
        }
    };

    // Open the delete confirmation dialog
    const openDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    // Edit CP Type (placeholder for future implementation)
    const handleEdit = (cpType) => {
        console.log('Editing CP Type:', cpType);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                <p className="ml-4">Loading CP Types...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p>{error}</p>
                <button
                    onClick={fetchCPTypes}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 bg-gray-100 border-b">
                    <h1 className="text-2xl font-bold text-gray-900">CP Types Management</h1>
                </div>

                <div className="p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-4 border-b">Thumbnail</th>
                                <th className="p-4 border-b">Name</th>
                                <th className="p-4 border-b">Type</th>
                                <th className="p-4 border-b">Veg/Non-Veg</th>
                                <th className="p-4 border-b">Description</th>
                                <th className="p-4 border-b">Price</th>
                                <th className="p-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cpTypes.map((cpType) => (
                                <tr key={cpType.id} className="border-t">
                                    <td className="p-4">
                                        <img
                                            src={`http://localhost/ms3/uploads/${cpType.image_address}`}
                                            alt={cpType.cp_name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="p-4">{cpType.cp_name}</td>
                                    <td className="p-4">{cpType.cp_type}</td>
                                    <td className="p-4">
                                        <span className={cpType.veg_non_veg === 'Veg' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                            {cpType.veg_non_veg}
                                        </span>
                                    </td>
                                    <td className="p-4">{cpType.description}</td>
                                    <td className="p-4">₹{cpType.price}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(cpType)}
                                                className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                                            >
                                                <Edit className="h-5 w-5 text-yellow-600" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteDialog(cpType.id)}
                                                className="p-2 bg-red-100 rounded hover:bg-red-200"
                                            >
                                                <Trash2 className="h-5 w-5 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {cpTypes.length === 0 && (
                        <div className="text-center text-gray-500 py-4">
                            No CP Types found. Add a new CP Type to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-4">This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CPTypesDisplay;