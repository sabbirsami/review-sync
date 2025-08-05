'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Bell, Globe, Palette, Shield, Sun, User } from 'lucide-react';
import { useState } from 'react';

const themeColors = [
  {
    name: 'Caribbean Current',
    colors: ['#0b5c58', '#1b5551', '#fbd686', '#f7f4e9'],
    variables: {
      '--background': '#f7f4e9',
      '--foreground': '#1b5551',
      '--card': '#ffffff',
      '--card-foreground': '#1b5551',
      '--popover': '#ffffff',
      '--popover-foreground': '#1b5551',
      '--primary': '#0b5c58',
      '--primary-foreground': '#f7f4e9',
      '--secondary': '#e8f4f3',
      '--secondary-foreground': '#1b5551',
      '--muted': '#f0ede0',
      '--muted-foreground': '#6b7b78',
      '--accent': '#fbd686',
      '--accent-foreground': '#1b5551',
      '--destructive': '#dc2626',
      '--border': '#d1d9d8',
      '--input': '#e5ebe9',
      '--ring': '#0b5c58',
      '--chart-1': '#0b5c58',
      '--chart-2': '#1b5551',
      '--chart-3': '#fbd686',
      '--chart-4': '#a8d5d1',
      '--chart-5': '#f7f4e9',
      '--sidebar': '#f7f4e9',
      '--sidebar-foreground': '#1b5551',
      '--sidebar-primary': '#0b5c58',
      '--sidebar-primary-foreground': '#f7f4e9',
      '--sidebar-accent': '#fbd686',
      '--sidebar-accent-foreground': '#1b5551',
      '--sidebar-border': '#d1d9d8',
      '--sidebar-ring': '#0b5c58',
    },
  },
  {
    name: 'Ocean Blue',
    colors: ['#1e40af', '#1e3a8a', '#fbbf24', '#f8fafc'],
    variables: {
      '--background': '#f8fafc',
      '--foreground': '#1e3a8a',
      '--card': '#ffffff',
      '--card-foreground': '#1e3a8a',
      '--popover': '#ffffff',
      '--popover-foreground': '#1e3a8a',
      '--primary': '#1e40af',
      '--primary-foreground': '#f8fafc',
      '--secondary': '#dbeafe',
      '--secondary-foreground': '#1e3a8a',
      '--muted': '#f1f5f9',
      '--muted-foreground': '#64748b',
      '--accent': '#fbbf24',
      '--accent-foreground': '#1e3a8a',
      '--destructive': '#dc2626',
      '--border': '#cbd5e1',
      '--input': '#e2e8f0',
      '--ring': '#1e40af',
      '--chart-1': '#1e40af',
      '--chart-2': '#1e3a8a',
      '--chart-3': '#fbbf24',
      '--chart-4': '#93c5fd',
      '--chart-5': '#f8fafc',
      '--sidebar': '#f8fafc',
      '--sidebar-foreground': '#1e3a8a',
      '--sidebar-primary': '#1e40af',
      '--sidebar-primary-foreground': '#f8fafc',
      '--sidebar-accent': '#fbbf24',
      '--sidebar-accent-foreground': '#1e3a8a',
      '--sidebar-border': '#cbd5e1',
      '--sidebar-ring': '#1e40af',
    },
  },
  {
    name: 'Forest Green',
    colors: ['#166534', '#15803d', '#f59e0b', '#f9fafb'],
    variables: {
      '--background': '#f9fafb',
      '--foreground': '#166534',
      '--card': '#ffffff',
      '--card-foreground': '#166534',
      '--popover': '#ffffff',
      '--popover-foreground': '#166534',
      '--primary': '#166534',
      '--primary-foreground': '#f9fafb',
      '--secondary': '#dcfce7',
      '--secondary-foreground': '#166534',
      '--muted': '#f3f4f6',
      '--muted-foreground': '#6b7280',
      '--accent': '#f59e0b',
      '--accent-foreground': '#166534',
      '--destructive': '#dc2626',
      '--border': '#d1d5db',
      '--input': '#e5e7eb',
      '--ring': '#166534',
      '--chart-1': '#166534',
      '--chart-2': '#15803d',
      '--chart-3': '#f59e0b',
      '--chart-4': '#86efac',
      '--chart-5': '#f9fafb',
      '--sidebar': '#f9fafb',
      '--sidebar-foreground': '#166534',
      '--sidebar-primary': '#166534',
      '--sidebar-primary-foreground': '#f9fafb',
      '--sidebar-accent': '#f59e0b',
      '--sidebar-accent-foreground': '#166534',
      '--sidebar-border': '#d1d5db',
      '--sidebar-ring': '#166534',
    },
  },
  {
    name: 'Royal Purple',
    colors: ['#7c3aed', '#8b5cf6', '#ec4899', '#faf9ff'],
    variables: {
      '--background': '#faf9ff',
      '--foreground': '#581c87',
      '--card': '#ffffff',
      '--card-foreground': '#581c87',
      '--popover': '#ffffff',
      '--popover-foreground': '#581c87',
      '--primary': '#7c3aed',
      '--primary-foreground': '#faf9ff',
      '--secondary': '#ede9fe',
      '--secondary-foreground': '#581c87',
      '--muted': '#f5f3ff',
      '--muted-foreground': '#6b7280',
      '--accent': '#ec4899',
      '--accent-foreground': '#581c87',
      '--destructive': '#dc2626',
      '--border': '#d1d5db',
      '--input': '#e5e7eb',
      '--ring': '#7c3aed',
      '--chart-1': '#7c3aed',
      '--chart-2': '#8b5cf6',
      '--chart-3': '#ec4899',
      '--chart-4': '#c4b5fd',
      '--chart-5': '#faf9ff',
      '--sidebar': '#faf9ff',
      '--sidebar-foreground': '#581c87',
      '--sidebar-primary': '#7c3aed',
      '--sidebar-primary-foreground': '#faf9ff',
      '--sidebar-accent': '#ec4899',
      '--sidebar-accent-foreground': '#581c87',
      '--sidebar-border': '#d1d5db',
      '--sidebar-ring': '#7c3aed',
    },
  },
  {
    name: 'Sunset Orange',
    colors: ['#ea580c', '#f97316', '#0891b2', '#fffbeb'],
    variables: {
      '--background': '#fffbeb',
      '--foreground': '#9a3412',
      '--card': '#ffffff',
      '--card-foreground': '#9a3412',
      '--popover': '#ffffff',
      '--popover-foreground': '#9a3412',
      '--primary': '#ea580c',
      '--primary-foreground': '#fffbeb',
      '--secondary': '#fed7aa',
      '--secondary-foreground': '#9a3412',
      '--muted': '#fef3c7',
      '--muted-foreground': '#78716c',
      '--accent': '#0891b2',
      '--accent-foreground': '#fffbeb',
      '--destructive': '#dc2626',
      '--border': '#d6d3d1',
      '--input': '#e7e5e4',
      '--ring': '#ea580c',
      '--chart-1': '#ea580c',
      '--chart-2': '#f97316',
      '--chart-3': '#0891b2',
      '--chart-4': '#fdba74',
      '--chart-5': '#fffbeb',
      '--sidebar': '#fffbeb',
      '--sidebar-foreground': '#9a3412',
      '--sidebar-primary': '#ea580c',
      '--sidebar-primary-foreground': '#fffbeb',
      '--sidebar-accent': '#0891b2',
      '--sidebar-accent-foreground': '#fffbeb',
      '--sidebar-border': '#d6d3d1',
      '--sidebar-ring': '#ea580c',
    },
  },
  {
    name: 'Midnight Dark',
    colors: ['#1f2937', '#374151', '#10b981', '#ffffff'],
    variables: {
      '--background': '#ffffff',
      '--foreground': '#1f2937',
      '--card': '#f9fafb',
      '--card-foreground': '#1f2937',
      '--popover': '#ffffff',
      '--popover-foreground': '#1f2937',
      '--primary': '#1f2937',
      '--primary-foreground': '#ffffff',
      '--secondary': '#f3f4f6',
      '--secondary-foreground': '#1f2937',
      '--muted': '#f9fafb',
      '--muted-foreground': '#6b7280',
      '--accent': '#10b981',
      '--accent-foreground': '#ffffff',
      '--destructive': '#dc2626',
      '--border': '#e5e7eb',
      '--input': '#f3f4f6',
      '--ring': '#1f2937',
      '--chart-1': '#1f2937',
      '--chart-2': '#374151',
      '--chart-3': '#10b981',
      '--chart-4': '#9ca3af',
      '--chart-5': '#ffffff',
      '--sidebar': '#ffffff',
      '--sidebar-foreground': '#1f2937',
      '--sidebar-primary': '#1f2937',
      '--sidebar-primary-foreground': '#ffffff',
      '--sidebar-accent': '#10b981',
      '--sidebar-accent-foreground': '#ffffff',
      '--sidebar-border': '#e5e7eb',
      '--sidebar-ring': '#1f2937',
    },
  },
];

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [selectedTheme, setSelectedTheme] = useState(themeColors[0]); // Caribbean Current as default
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const handleThemeChange = (theme: (typeof themeColors)[0]) => {
    setSelectedTheme(theme);
    const root = document.documentElement;

    // Update all CSS variables
    Object.entries(theme.variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  return (
    <>
      <SheetHeader className="px-10">
        <SheetTitle className="text-foreground text-2xl font-semibold -mb-3">Settings</SheetTitle>
        <SheetDescription className="text-muted-foreground hidden"></SheetDescription>
      </SheetHeader>
      <Separator className="bg-border" />
      <div className="mt-6 space-y-6 px-10 pb-10 overscroll-y-auto">
        {/* Theme Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-foreground" />
            <Label className="text-base font-medium text-foreground">Color Theme</Label>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {themeColors.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme)}
                className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedTheme.name === theme.name
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{theme.name}</span>
                  <div className="flex space-x-1">
                    {theme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Appearance Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-foreground" />
            <Label className="text-base font-medium text-foreground">Appearance</Label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-foreground" />
            <Label className="text-base font-medium text-foreground">Notifications</Label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive notifications about updates</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Account Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-foreground" />
            <Label className="text-base font-medium text-foreground">Account</Label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">Public Profile</Label>
                <p className="text-xs text-muted-foreground">Make your profile visible to others</p>
              </div>
              <Switch
                checked={publicProfile}
                onCheckedChange={setPublicProfile}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-foreground">Auto-save</Label>
                <p className="text-xs text-muted-foreground">Automatically save your changes</p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Privacy & Security */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-foreground" />
            <Label className="text-base font-medium text-foreground">Privacy & Security</Label>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-foreground border-border hover:bg-secondary bg-transparent"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-foreground border-border hover:bg-secondary bg-transparent"
            >
              Two-Factor Authentication
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-foreground border-border hover:bg-secondary bg-transparent"
            >
              Privacy Settings
            </Button>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Language & Region */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-foreground" />
            <Label className="text-base font-medium text-foreground">Language & Region</Label>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-foreground border-border hover:bg-secondary bg-transparent"
            >
              Language: English
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-foreground border-border hover:bg-secondary bg-transparent"
            >
              Time Zone: UTC-5
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-2">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onClose}
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            className="w-full text-foreground border-border hover:bg-secondary bg-transparent"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
