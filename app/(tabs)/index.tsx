import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Chrome as Home, Users, Building, CreditCard, TrendingUp, CircleAlert as AlertCircle, Calendar, IndianRupee } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { rooms, tenants, payments } = useAppContext();

  const stats = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(room => room.occupied > 0).length,
    totalTenants: tenants.filter(tenant => tenant.status === 'Active').length,
    monthlyRevenue: tenants.reduce((sum, tenant) => sum + tenant.rent, 0),
    pendingPayments: payments.filter(payment => payment.status === 'Pending' || payment.status === 'Overdue').length,
    maintenanceRequests: 3,
  };

  const paymentReminders = payments
    .filter(payment => payment.status === 'Overdue')
    .map(payment => ({
      id: payment.id,
      tenantName: payment.tenantName,
      roomNumber: payment.roomNumber,
      amount: payment.amount,
      daysOverdue: Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)),
    }));

  const occupancyRate = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    color, 
    subtitle 
  }: {
    icon: any;
    title: string;
    value: string | number;
    color: string;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const PaymentReminderCard = ({ reminder }: { reminder: PaymentReminder }) => (
    <TouchableOpacity style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <View>
          <Text style={styles.reminderName}>{reminder.tenantName}</Text>
          <Text style={styles.reminderRoom}>Room {reminder.roomNumber}</Text>
        </View>
        <View style={styles.reminderAmount}>
          <Text style={styles.reminderAmountText}>₹{reminder.amount.toLocaleString()}</Text>
          <Text style={[
            styles.reminderDays,
            { color: reminder.daysOverdue > 5 ? '#EF4444' : '#F59E0B' }
          ]}>
            {reminder.daysOverdue} days overdue
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.subtitle}>Here's your PG overview</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <AlertCircle size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={Building}
            title="Total Rooms"
            value={stats.totalRooms}
            color="#3B82F6"
            subtitle={`${stats.occupiedRooms} occupied`}
          />
          <StatCard
            icon={Users}
            title="Active Tenants"
            value={stats.totalTenants}
            color="#10B981"
          />
          <StatCard
            icon={TrendingUp}
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            color="#8B5CF6"
          />
          <StatCard
            icon={IndianRupee}
            title="Monthly Revenue"
            value={`₹${(stats.monthlyRevenue / 1000)}K`}
            color="#06B6D4"
          />
        </View>

        {/* Payment Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Reminders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {paymentReminders.slice(0, 3).map((reminder) => (
            <PaymentReminderCard key={reminder.id} reminder={reminder} />
          ))}
          
          {paymentReminders.length === 0 && (
            <View style={styles.noReminders}>
              <Text style={styles.noRemindersText}>No overdue payments</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Users size={24} color="#3B82F6" />
              <Text style={styles.actionText}>Add Tenant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Building size={24} color="#10B981" />
              <Text style={styles.actionText}>Add Room</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <CreditCard size={24} color="#8B5CF6" />
              <Text style={styles.actionText}>Record Payment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Payment received from Rahul Sharma</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New tenant onboarded in Room R-308</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Maintenance request from Room R-205</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 44) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reminderRoom: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  reminderAmount: {
    alignItems: 'flex-end',
  },
  reminderAmountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  reminderDays: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  activityList: {
    marginTop: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});