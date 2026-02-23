'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDepartments, useUsers, useTransferAsset } from '@/lib/query/hooks/useAsset';
import { toast } from 'react-toastify';

const schema = z.object({
    departmentId: z.string().min(1, 'Department is required'),
    assignedToId: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    assetId: string;
    assetName: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export function TransferAssetDialog({ assetId, assetName, onClose, onSuccess }: Props) {
    const { data: departments = [] } = useDepartments();
    const { data: users = [] } = useUsers();
    const transferAsset = useTransferAsset(assetId);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        try {
            await transferAsset.mutateAsync({
                departmentId: values.departmentId,
                assignedToId: values.assignedToId || undefined,
                location: values.location || undefined,
                notes: values.notes || undefined,
            });
            toast.success('Asset transferred successfully');
            onSuccess?.();
            onClose();
        } catch (err: any) {
            const message = err.message || 'Failed to transfer asset.';
            setError('root', { message });
            toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-base font-semibold text-gray-900">Transfer Asset: {assetName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                    {/* Department */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Destination Department *</label>
                        <select
                            {...register('departmentId')}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                            <option value="">Select department</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        {errors.departmentId && <p className="text-xs text-red-500">{errors.departmentId.message}</p>}
                    </div>

                    {/* Assigned To */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Assign To (Optional)</label>
                        <select
                            {...register('assignedToId')}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                            <option value="">Unassigned</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        id="location"
                        label="New Location (Optional)"
                        placeholder="e.g. Building B, Room 102"
                        {...register('location')}
                    />

                    <div className="flex flex-col gap-1">
                        <label htmlFor="notes" className="text-sm font-medium text-gray-700">Transfer Notes (Optional)</label>
                        <textarea
                            id="notes"
                            rows={3}
                            placeholder="Reason for transfer, current condition, etc..."
                            {...register('notes')}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                    </div>

                    {errors.root && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {errors.root.message}
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={transferAsset.isPending}>
                            {transferAsset.isPending && <Loader2 size={18} className="animate-spin mr-2" />}
                            Complete Transfer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
