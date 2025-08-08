import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Settings, Bell, FileText, CircleHelp as HelpCircle, Shield, Database, Smartphone, Moon, Globe, ChevronRight, User, Building, CreditCard, ChartBar as BarChart3, Wrench, MessageCircle, LogOut, Info } from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function More() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Settings',
          subtitle: 'Manage your account information',
          icon: User,
          type: 'navigation',
          onPress: () => Alert.alert('Profile', 'Profile settings coming soon!'),
        },
        {
          id: 'properties',
          title: 'Properties',
          subtitle: 'Manage multiple properties',
          icon: Building,
          type: 'navigation',
          onPress: () => Alert.alert('Properties', 'Multi-property support coming soon!'),
        },
      ],
    },
    {
      title: 'Business',
      items: [
        {
          id: 'expenses',
          title: 'Expense Management',
          subtitle: 'Track business expenses',
          icon: CreditCard,
          type: 'navigation',
          onPress: () => Alert.alert('Expenses', 'Expense tracking coming soon!'),
        },
        {
          id: 'reports',
          title: 'Reports & Analytics',
          subtitle: 'View detailed business reports',
          icon: BarChart3,
          type: 'navigation',
          onPress: () => Alert.alert('Reports', 'Advanced reports coming soon!'),
        },
        {
          id: 'maintenance',
          title: 'Maintenance Requests',
          subtitle: 'Manage property maintenance',
          icon: Wrench,
          type: 'navigation',
          onPress: () => Alert.alert('Maintenance', 'Maintenance system coming soon!'),
        },
        {
          id: 'communication',
          title: 'Communication Hub',
          subtitle: 'Message tenants and staff',
          icon: MessageCircle,
          type: 'navigation',
          onPress: () => Alert.alert('Communication', 'Communication features coming soon!'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Push notifications and alerts',
          icon: Bell,
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: Moon,
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English (US)',
          icon: Globe,
          type: 'navigation',
          onPress: () => Alert.alert('Language', 'Language settings coming soon!'),
        },
      ],
    },
    {
      title: 'Data & Security',
      items: [
        {
          id: 'backup',
          title: 'Auto Backup',
          subtitle: 'Automatically backup your data',
          icon: Database,
          type: 'toggle',
          value: autoBackup,
          onToggle: setAutoBackup,
        },
        {
          id: 'security',
          title: 'Security Settings',
          subtitle: 'Manage security preferences',
          icon: Shield,
          type: 'navigation',
          onPress: () => Alert.alert('Security', 'Security settings coming soon!'),
        },
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Download your data as CSV/PDF',
          icon: FileText,
          type: 'navigation',
          onPress: () => Alert.alert('Export', 'Data export coming soon!'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          icon: HelpCircle,
          type: 'navigation',
          onPress: () => Alert.alert('Help', 'Help center coming soon!'),
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'App version and information',
          icon: Info,
          type: 'navigation',
          onPress: () => Alert.alert('About', 'PG Manager v1.0.0\n\nBuilt with React Native & Expo'),
        },
      ],
    },
  ];

  const SettingItem = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <item.icon size={20} color="#3B82F6" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
          />
        ) : (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => Alert.alert('Logged Out', 'You have been logged out successfully!')
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@email.com</Text>
            <Text style={styles.profileRole}>PG Owner</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Building size={24} color="#3B82F6" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Rooms</Text>
          </View>
          <View style={styles.statItem}>
            <User size={24} color="#10B981" />
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Tenants</Text>
          </View>
          <View style={styles.statItem}>
            <CreditCard size={24} color="#F59E0B" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <SettingItem item={item} />
                  {itemIndex < group.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  profileRole: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 4,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  settingsGroup: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  groupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 20,
    marginBottom: 40,
  },
});