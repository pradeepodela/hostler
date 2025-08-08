import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Bed, Plus, User, UserX, CreditCard as Edit3, Trash2, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  isOccupied: boolean;
  tenantName?: string;
  tenantId?: string;
  monthlyRent: number;
}

interface BedManagementProps {
  roomId: string;
  roomNumber: string;
  beds: Bed[];
  onBedsUpdate: (beds: Bed[]) => void;
}

export default function BedManagement({ roomId, roomNumber, beds, onBedsUpdate }: BedManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [newBed, setNewBed] = useState({
    bedNumber: '',
    monthlyRent: '',
  });

  const handleAddBed = () => {
    if (!newBed.bedNumber || !newBed.monthlyRent) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const bed: Bed = {
      id: Date.now().toString(),
      roomId,
      bedNumber: newBed.bedNumber,
      isOccupied: false,
      monthlyRent: parseInt(newBed.monthlyRent),
    };

    const updatedBeds = [...beds, bed];
    onBedsUpdate(updatedBeds);
    setNewBed({ bedNumber: '', monthlyRent: '' });
    setShowModal(false);
  };

  const handleEditBed = (bed: Bed) => {
    setEditingBed(bed);
    setNewBed({
      bedNumber: bed.bedNumber,
      monthlyRent: bed.monthlyRent.toString(),
    });
    setShowModal(true);
  };

  const handleUpdateBed = () => {
    if (!editingBed || !newBed.bedNumber || !newBed.monthlyRent) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const updatedBeds = beds.map(bed =>
      bed.id === editingBed.id
        ? {
            ...bed,
            bedNumber: newBed.bedNumber,
            monthlyRent: parseInt(newBed.monthlyRent),
          }
        : bed
    );

    onBedsUpdate(updatedBeds);
    setEditingBed(null);
    setNewBed({ bedNumber: '', monthlyRent: '' });
    setShowModal(false);
  };

  const handleDeleteBed = (bedId: string) => {
    Alert.alert(
      'Delete Bed',
      'Are you sure you want to delete this bed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedBeds = beds.filter(bed => bed.id !== bedId);
            onBedsUpdate(updatedBeds);
          },
        },
      ]
    );
  };

  const BedCard = ({ bed }: { bed: Bed }) => (
    <View style={styles.bedCard}>
      <View style={styles.bedHeader}>
        <View style={styles.bedInfo}>
          <View style={[
            styles.bedIcon,
            { backgroundColor: bed.isOccupied ? '#FEF3C7' : '#ECFDF5' }
          ]}>
            <Bed size={20} color={bed.isOccupied ? '#F59E0B' : '#10B981'} />
          </View>
          <View style={styles.bedDetails}>
            <Text style={styles.bedNumber}>Bed {bed.bedNumber}</Text>
            <Text style={styles.bedRent}>₹{bed.monthlyRent.toLocaleString()}/month</Text>
          </View>
        </View>
        
        <View style={styles.bedActions}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: bed.isOccupied ? '#FEF3C7' : '#ECFDF5' }
          ]}>
            {bed.isOccupied ? (
              <UserX size={12} color="#F59E0B" />
            ) : (
              <CheckCircle size={12} color="#10B981" />
            )}
            <Text style={[
              styles.statusText,
              { color: bed.isOccupied ? '#F59E0B' : '#10B981' }
            ]}>
              {bed.isOccupied ? 'Occupied' : 'Available'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditBed(bed)}
          >
            <Edit3 size={14} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteBed(bed.id)}
          >
            <Trash2 size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {bed.isOccupied && bed.tenantName && (
        <View style={styles.tenantInfo}>
          <User size={16} color="#6B7280" />
          <Text style={styles.tenantName}>{bed.tenantName}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Beds in Room {roomNumber}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingBed(null);
            setNewBed({ bedNumber: '', monthlyRent: '' });
            setShowModal(true);
          }}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.bedsList} showsVerticalScrollIndicator={false}>
        {beds.map((bed) => (
          <BedCard key={bed.id} bed={bed} />
        ))}
        
        {beds.length === 0 && (
          <View style={styles.emptyState}>
            <Bed size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No beds added yet</Text>
            <Text style={styles.emptySubtext}>Add beds to start managing occupancy</Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Bed Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingBed ? 'Edit Bed' : 'Add New Bed'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Bed Number (e.g., B-1)"
              value={newBed.bedNumber}
              onChangeText={(text) => setNewBed({...newBed, bedNumber: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Monthly Rent"
              value={newBed.monthlyRent}
              onChangeText={(text) => setNewBed({...newBed, monthlyRent: text})}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowModal(false);
                  setEditingBed(null);
                  setNewBed({ bedNumber: '', monthlyRent: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={editingBed ? handleUpdateBed : handleAddBed}
              >
                <Text style={styles.saveButtonText}>
                  {editingBed ? 'Update Bed' : 'Add Bed'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 10,
  },
  bedsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  bedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bedDetails: {
    flex: 1,
  },
  bedNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bedRent: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  bedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  tenantName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
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