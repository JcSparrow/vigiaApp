import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { updateNotificationPreferences } from '../lib/notifications';
import { toast } from 'react-toastify';

interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  location_radius: number;
  location_lat: number | null;
  location_lng: number | null;
  notify_new_cases: boolean;
  notify_updates: boolean;
  notify_vehicle_only: boolean;
  notify_person_only: boolean;
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_enabled: true,
    email_enabled: true,
    location_radius: 10,
    location_lat: null,
    location_lng: null,
    notify_new_cases: true,
    notify_updates: true,
    notify_vehicle_only: false,
    notify_person_only: false
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setPreferences(data);
    } catch (error) {
      toast.error('Erro ao carregar preferências');
    }
  }

  async function handlePreferenceChange(
    key: keyof NotificationPreferences,
    value: boolean | number
  ) {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await updateNotificationPreferences({ [key]: value });
      toast.success('Preferências atualizadas');
    } catch (error) {
      toast.error('Erro ao atualizar preferências');
    }
  }

  async function handleLocationUpdate() {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const newPreferences = {
          ...preferences,
          location_lat: position.coords.latitude,
          location_lng: position.coords.longitude
        };

        setPreferences(newPreferences);
        await updateNotificationPreferences(newPreferences);
        toast.success('Localização atualizada');
      } catch (error) {
        toast.error('Erro ao obter localização');
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Settings className="h-5 w-5 mr-2" />
        Preferências de Notificação
      </h2>

      <div className="space-y-6">
        {/* Notification Methods */}
        <div>
          <h3 className="text-lg font-medium mb-4">Métodos de Notificação</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.push_enabled}
                onChange={(e) => handlePreferenceChange('push_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Notificações Push</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.email_enabled}
                onChange={(e) => handlePreferenceChange('email_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Notificações por Email</span>
            </label>
          </div>
        </div>

        {/* Location Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Configurações de Localização</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raio de Notificações (km)
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={preferences.location_radius}
                onChange={(e) => handlePreferenceChange('location_radius', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                {preferences.location_radius} km
              </div>
            </div>

            <button
              onClick={handleLocationUpdate}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Atualizar Localização
            </button>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="text-lg font-medium mb-4">Tipos de Notificação</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notify_new_cases}
                onChange={(e) => handlePreferenceChange('notify_new_cases', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Novos Casos</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notify_updates}
                onChange={(e) => handlePreferenceChange('notify_updates', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Atualizações de Casos</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notify_vehicle_only}
                onChange={(e) => handlePreferenceChange('notify_vehicle_only', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Apenas Veículos</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.notify_person_only}
                onChange={(e) => handlePreferenceChange('notify_person_only', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Apenas Pessoas</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}