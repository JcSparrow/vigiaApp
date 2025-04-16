import { supabase } from './supabase';

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await registerServiceWorker();
      const subscription = await registerPushSubscription(registration);
      await savePushSubscription(subscription);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator && !window.navigator.userAgent.includes('StackBlitz')) {
    try {
      return await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service worker not supported');
}

async function registerPushSubscription(registration: ServiceWorkerRegistration) {
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
  });
  return subscription;
}

async function savePushSubscription(subscription: PushSubscription) {
  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    subscription: JSON.stringify(subscription)
  });

  if (error) throw error;
}

export async function updateNotificationPreferences(preferences: {
  push_enabled?: boolean;
  email_enabled?: boolean;
  location_radius?: number;
  location_lat?: number;
  location_lng?: number;
  notify_new_cases?: boolean;
  notify_updates?: boolean;
  notify_vehicle_only?: boolean;
  notify_person_only?: boolean;
}) {
  const { error } = await supabase
    .from('notification_preferences')
    .update(preferences)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
}

export async function getNotifications(limit = 20) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}