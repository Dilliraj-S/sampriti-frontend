"use client";

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { notificationStore } from '@/lib/notificationStore';
import { toast } from 'sonner';

export function RealtimeNotifications() {
  useEffect(() => {
    const socket = getSocket();

    const handleNewPayment = (data: { orderId: number; customerName: string; total: number; currency: string; time: string }) => {
      notificationStore.addNotification({
        id: `payment-${data.orderId}-${Date.now()}`,
        title: 'New Payment Received',
        message: `${data.customerName} paid $${data.total.toFixed(2)} ${data.currency} (Order #${data.orderId})`,
        type: 'success',
        priority: 'high',
        created_at: data.time,
        status: 'unread',
      });

      toast.success(`$${data.total.toFixed(2)} payment from ${data.customerName}`, {
        description: `Order #${data.orderId}`,
        duration: 5000,
      });
    };

    socket.on('new_payment', handleNewPayment);
    socket.on('connect', () => console.log('[Realtime] Socket connected'));
    socket.on('disconnect', () => console.log('[Realtime] Socket disconnected'));

    return () => {
      socket.off('new_payment', handleNewPayment);
    };
  }, []);

  return null;
}
