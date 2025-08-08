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
} from 'react-native';
import { Plus, Search, Filter, Bed, Snowflake, Thermometer, Users, CreditCard as Edit3, Trash2 } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';

export default function Rooms() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'AC',
    capacity: '2',
    rent: '',
  });

  const filters = ['All', 'AC', 'Non-AC', 'Deluxe', 'Standard', 'Available', 'Full', 'Maintenance'];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || 
                         room.type === selectedFilter || 
                         room.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#10B981';
      case 'Full':
        return '#EF4444';
      case 'Maintenance':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'AC':
        return <Snowflake size={16} color="#3B82F6" />;
      case 'Non-AC':
        return <Thermometer size={16} color="#F59E0B" />;
      case 'Deluxe':
        return <Users size={16} color="#8B5CF6" />;
      default:
        return <Bed size={16} color="#6B7280" />;
    }
  };

  const handleAddRoom = () => {
    if (!newRoom.number || !newRoom.rent) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const roomData = {
      number: newRoom.number,
      type: newRoom.type as any,
      capacity: parseInt(newRoom.capacity),
      occupied: 0,
      rent: parseInt(newRoom.rent),
      status: 'Available',
    };

    addRoom(roomData);
    setNewRoom({ number: '', type: 'AC', capacity: '2', rent: '' });
    setShowAddModal(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    Alert.alert(
      'Delete Room',
      'Are you sure you want to delete this room? All tenants in this room will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRoom(roomId),
        },
      ]
    );
  };

  const RoomCard = ({ room }: { room: any }) => (
    <View style={styles.roomCard}>
      <View style={styles.roomHeader}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomNumber}>{room.number}</Text>
          <View style={styles.roomType}>
            {getTypeIcon(room.type)}
            <Text style={styles.roomTypeText}>{room.type}</Text>
          </View>
        </View>
        <View style={styles.roomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit3 size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteRoom(room.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.roomDetails}>
        <View style={styles.occupancyInfo}>
          <Text style={styles.occupancyText}>
            {room.occupied}/{room.capacity} occupied
          </Text>
          <View style={styles.occupancyBar}>
            <View 
              style={[
                styles.occupancyFill,
                { 
                  width: `${(room.occupied / room.capacity) * 100}%`,
                  backgroundColor: room.occupied === room.capacity ? '#EF4444' : '#10B981'
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.roomFooter}>
          <Text style={styles.rentText}>
            {room.beds.length > 0 
              ? `₹${Math.min(...room.beds.map(b => b.monthlyRent)).toLocaleString()} - ₹${Math.max(...room.beds.map(b => b.monthlyRent)).toLocaleString()}/month`
              : `₹${room.rent.toLocaleString()}/month`
            }
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(room.status) }]}>
            <Text style={styles.statusText}>{room.status}</Text>
          </View>
        </View>
        
        {room.beds.length > 0 && (
          <View style={styles.bedsInfo}>
            <Text style={styles.bedsTitle}>Beds ({room.beds.length}):</Text>
            <View style={styles.bedsList}>
              {room.beds.map((bed: any) => (
                <View key={bed.id} style={[
                  styles.bedChip,
                  { backgroundColor: bed.isOccupied ? '#FEE2E2' : '#ECFDF5' }
                ]}>
                  <Text style={[
                    styles.bedChipText,
                    { color: bed.isOccupied ? '#DC2626' : '#059669' }
                  ]}>
                    {bed.bedNumber}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rooms Management</Text>
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
            placeholder="Search rooms..."
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

      {/* Rooms List */}
      <ScrollView style={styles.roomsList} showsVerticalScrollIndicator={false}>
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </ScrollView>

      {/* Add Room Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Room</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Room Number (e.g., R-101)"
              value={newRoom.number}
              onChangeText={(text) => setNewRoom({...newRoom, number: text})}
            />
            
            <View style={styles.typeSelector}>
              {['AC', 'Non-AC', 'Deluxe', 'Standard'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newRoom.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setNewRoom({...newRoom, type})}
                >
                  <Text style={[
                    styles.typeButtonText,
                    newRoom.type === type && styles.typeButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Bed Capacity"
              value={newRoom.capacity}
              onChangeText={(text) => setNewRoom({...newRoom, capacity: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Monthly Rent"
              value={newRoom.rent}
              onChangeText={(text) => setNewRoom({...newRoom, rent: text})}
              keyboardType="numeric"
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
                onPress={handleAddRoom}
              >
                <Text style={styles.saveButtonText}>Add Room</Text>
              </TouchableOpacity>
            </View>
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
  roomsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomCard: {
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
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  roomType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomTypeText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  roomActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  roomDetails: {
    gap: 12,
  },
  occupancyInfo: {
    gap: 8,
  },
  occupancyText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  occupancyBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    borderRadius: 3,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rentText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
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
    maxWidth: 400,
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
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
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
  bedsInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bedsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  bedsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bedChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bedChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});