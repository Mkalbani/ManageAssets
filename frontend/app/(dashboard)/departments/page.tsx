'use client';

import React, { useState } from 'react';
import {
    useDepartmentsList,
    useCreateDepartment,
    useDeleteDepartment,
    useCategories,
    useCreateCategory,
    useDeleteCategory
} from '@/lib/query/hooks/query.hook';
import { DepartmentWithCount, CategoryWithCount } from '@/lib/api/assets';
import { Plus, Trash2, LayoutGrid, Tags, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

type TabType = 'departments' | 'categories';

export default function DepartmentsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('departments');
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const { data: departments, isLoading: isLoadingDepts } = useDepartmentsList();
    const { data: categories, isLoading: isLoadingCats } = useCategories();

    const createDept = useCreateDepartment();
    const deleteDept = useDeleteDepartment();
    const createCat = useCreateCategory();
    const deleteCat = useDeleteCategory();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        try {
            if (activeTab === 'departments') {
                await createDept.mutateAsync(formData);
            } else {
                await createCat.mutateAsync(formData);
            }
            toast.success(`${activeTab === 'departments' ? 'Department' : 'Category'} created successfully`);
            setFormData({ name: '', description: '' });
            setIsAdding(false);
        } catch (err: any) {
            toast.error(err.message || `Failed to create ${activeTab}`);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmMessage = `Are you sure you want to delete ${name}? Assets in this ${activeTab === 'departments' ? 'department' : 'category'} will need to be reassigned/recategorised.`;
        if (!window.confirm(confirmMessage)) return;

        try {
            if (activeTab === 'departments') {
                await deleteDept.mutateAsync(id);
            } else {
                await deleteCat.mutateAsync(id);
            }
            toast.success(`${activeTab === 'departments' ? 'Department' : 'Category'} deleted successfully`);
        } catch (err: any) {
            toast.error(err.message || `Failed to delete ${activeTab}`);
        }
    };

    const items = activeTab === 'departments' ? departments : categories;
    const isLoading = activeTab === 'departments' ? isLoadingDepts : isLoadingCats;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Management</h1>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => { setActiveTab('departments'); setIsAdding(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'departments'
                                ? 'bg-white shadow-sm text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <LayoutGrid size={18} />
                        Departments
                        {departments && <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{departments.length}</span>}
                    </button>
                    <button
                        onClick={() => { setActiveTab('categories'); setIsAdding(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'categories'
                                ? 'bg-white shadow-sm text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Tags size={18} />
                        Categories
                        {categories && <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{categories.length}</span>}
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center py-4 border-b">
                <h2 className="text-xl font-semibold capitalize">
                    {activeTab} ({items?.length || 0})
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Add {activeTab === 'departments' ? 'Department' : 'Category'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow-sm border animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Name *</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            {activeTab === 'departments' ? createDept.isError && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} /> {createDept.error?.message}
                                </p>
                            ) : createCat.isError && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} /> {createCat.error?.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                            <input
                                type="text"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createDept.isPending || createCat.isPending}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            {(createDept.isPending || createCat.isPending) && <Loader2 size={18} className="animate-spin" />}
                            Save {activeTab === 'departments' ? 'Department' : 'Category'}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                    <Loader2 size={40} className="animate-spin text-blue-500" />
                    <p>Loading {activeTab}...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items?.map((item: any) => (
                        <div key={item.id} className="group relative bg-white p-6 rounded-xl border hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">{item.name}</h3>
                                <button
                                    onClick={() => handleDelete(item.id, item.name)}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed min-h-[40px] mb-4">
                                {item.description || 'No description provided.'}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Asset Count</span>
                                <span className="text-lg font-bold text-blue-600">{item.assetCount || 0}</span>
                            </div>
                        </div>
                    ))}
                    {!isLoading && items?.length === 0 && (
                        <div className="col-span-full bg-gray-50 border-2 border-dashed rounded-xl py-20 flex flex-col items-center justify-center text-gray-400">
                            <AlertCircle size={40} className="mb-2" />
                            <p>No {activeTab} found. Create one to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
