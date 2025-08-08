import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Plus, Search, Filter, Phone, Mail, Calendar, MapPin, CreditCard as Edit3, Trash2, User, CreditCard, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
  bedNumber: string;
  joinDate: string;
  rent: number;
  deposit: number;
  status: 'Active' | 'Pending' | 'Inactive';
  lastPayment: string;
  nextPaymentDue: string;
  address: string;
  emergencyContact: string;
  photo?: string;
}

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      roomNumber: 'R-101',
      bedNumber: 'B-1',
      joinDate: '2024-01-15',
      rent: 12000,
      deposit: 24000,
      status: 'Active',
      lastPayment: '2024-01-01',
      nextPaymentDue: '2024-02-01',
      address: 'Delhi, India',
      emergencyContact: '+91 9876543211',
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 9876543212',
      roomNumber: 'R-205',
      bedNumber: 'B-2',
      joinDate: '2024-01-20',
      rent: 10000,
      deposit: 20000,
      status: 'Active',
      lastPayment: '2023-12-28',
      nextPaymentDue: '2024-01-28',
      address: 'Mumbai, India',
      emergencyContact: '+91 9876543213',
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 9876543214',
      roomNumber: 'R-312',
      bedNumber: 'B-1',
      joinDate: '2024-02-01',
      rent: 9500,
      deposit: 19000,
      status: 'Pending',
      lastPayment: '2024-01-15',
      nextPaymentDue: '2024-02-15',
      address: 'Bangalore, India',
      emergencyContact: '+91 9876543215',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    bedNumber: '',
    rent: '',
    deposit: '',
    address: '',
    emergencyContact: '',
  });

  const filters = ['All', 'Active', 'Pending', 'Inactive'];

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || tenant.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10B981';
      case 'Pending':
        return '#F59E0B';
      case 'Inactive':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const isPaymentOverdue = (nextPaymentDue: string) => {
    return new Date(nextPaymentDue) < new Date();
  };

  const handleAddTenant = () => {
    if (!newTenant.name || !newTenant.email || !newTenant.phone || !newTenant.roomNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const tenant: Tenant = {
      id: Date.now().toString(),
      name: newTenant.name,
      email: newTenant.email,
      phone: newTenant.phone,
      roomNumber: newTenant.roomNumber,
      bedNumber: newTenant.bedNumber,
      joinDate: new Date().toISOString().split('T')[0],
      rent: parseInt(newTenant.rent) || 0,
      deposit: parseInt(newTenant.deposit) || 0,
      status: 'Pending',
      lastPayment: '',
      nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      address: newTenant.address,
      emergencyContact: newTenant.emergencyContact,
    };

    setTenants([...tenants, tenant]);
    setNewTenant({
      name: '',
      email: '',
      phone: '',
      roomNumber: '',
      bedNumber: '',
      rent: '',
      deposit: '',
      address: '',
      emergencyContact: '',
    });
    setShowAddModal(false);
  };

  const TenantCard = ({ tenant }: { tenant: Tenant }) => (
    <View style={styles.tenantCard}>
      <View style={styles.tenantHeader}>
        <View style={styles.tenantInfo}>
          <View style={styles.avatarContainer}>
            {tenant.photo ? (
              <Image source={{ uri: tenant.photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={24} color="#6B7280" />
              </View>
            )}
          </View>
          <View style={styles.tenantDetails}>
            <Text style={styles.tenantName}>{tenant.name}</Text>
            <Text style={styles.tenantRoom}>Room {tenant.roomNumber} • Bed {tenant.bedNumber}</Text>
          </View>
        </View>
        <View style={styles.tenantActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tenant.status) }]}>
            <Text style={styles.statusText}>{tenant.status}</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Edit3 size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tenantMeta}>
        <View style={styles.metaItem}>
          <Phone size={16} color="#6B7280" />
          <Text style={styles.metaText}>{tenant.phone}</Text>
        </View>
        <View style={styles.metaItem}>
          <Mail size={16} color="#6B7280" />
          <Text style={styles.metaText}>{tenant.email}</Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.metaText}>{tenant.address}</Text>
        </View>
      </View>

      <View style={styles.paymentInfo}>
        <View style={styles.paymentItem}>
          <Text style={styles.paymentLabel}>Monthly Rent</Text>
          <Text style={styles.paymentValue}>₹{tenant.rent.toLocaleString()}</Text>
        </View>
        <View style={styles.paymentItem}>
          <Text style={styles.paymentLabel}>Next Due Date</Text>
          <View style={styles.dueDateContainer}>
            <Text style={[
              styles.paymentValue,
              { color: isPaymentOverdue(tenant.nextPaymentDue) ? '#EF4444' : '#6B7280' }
            ]}>
              {new Date(tenant.nextPaymentDue).toLocaleDateString()}
            </Text>
            {isPaymentOverdue(tenant.nextPaymentDue) && (
              <AlertCircle size={16} color="#EF4444" />
            )}
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.primaryButton}>
          <CreditCard size={16} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Record Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Phone size={16} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Mail size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tenants Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tenants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter && styles.filterChipTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tenants.length}</Text>
          <Text style={styles.statLabel}>Total Tenants</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tenants.filter(t => t.status === 'Active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tenants.filter(t => isPaymentOverdue(t.nextPaymentDue)).length}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      {/* Tenants List */}
      <ScrollView style={styles.tenantsList} showsVerticalScrollIndicator={false}>
        {filteredTenants.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </ScrollView>

      {/* Add Tenant Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add New Tenant</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={newTenant.name}
                onChangeText={(text) => setNewTenant({...newTenant, name: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email Address *"
                value={newTenant.email}
                onChangeText={(text) => setNewTenant({...newTenant, email: text})}
                keyboardType="email-address"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                value={newTenant.phone}
                onChangeText={(text) => setNewTenant({...newTenant, phone: text})}
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Room Number *"
                value={newTenant.roomNumber}
                onChangeText={(text) => setNewTenant({...newTenant, roomNumber: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Bed Number"
                value={newTenant.bedNumber}
                onChangeText={(text) => setNewTenant({...newTenant, bedNumber: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Monthly Rent"
                value={newTenant.rent}
                onChangeText={(text) => setNewTenant({...newTenant, rent: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Security Deposit"
                value={newTenant.deposit}
                onChangeText={(text) => setNewTenant({...newTenant, deposit: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={newTenant.address}
                onChangeText={(text) => setNewTenant({...newTenant, address: text})}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact"
                value={newTenant.emergencyContact}
                onChangeText={(text) => setNewTenant({...newTenant, emergencyContact: text})}
                keyboardType="phone-pad"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddTenant}
                >
                  <Text style={styles.saveButtonText}>Add Tenant</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  tenantsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tenantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tenantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tenantDetails: {
    flex: 1,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  tenantRoom: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  tenantActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  tenantMeta: {
    gap: 8,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },
  paymentItem: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});