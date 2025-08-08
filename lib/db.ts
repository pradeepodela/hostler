import * as SQLite from 'expo-sqlite';
let randomUUID: () => string;
try {
  // expo-crypto is optional; fallback to nanoid-like if unavailable
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('expo-crypto') as { randomUUID?: () => string };
  randomUUID = crypto?.randomUUID ?? (() => Math.random().toString(36).slice(2) + Date.now().toString(36));
} catch {
  randomUUID = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type UUID = string;

export type TenantStatus = 'Active' | 'Pending' | 'Inactive';

export interface Tenant {
  id: UUID;
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
  bedNumber: string;
  joinDate: string; // ISO
  rent: number;
  deposit: number;
  status: TenantStatus;
  lastPayment?: string | null; // ISO
  nextPaymentDue?: string | null; // ISO
  address?: string | null;
  emergencyContact?: string | null;
  photo?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Room {
  id: UUID;
  roomNumber: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bed {
  id: UUID;
  roomId: UUID;
  bedNumber: string;
  isOccupied: number; // 0/1
  tenantId?: UUID | null;
  monthlyRent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: UUID;
  tenantId: UUID;
  amount: number;
  date: string; // ISO
  method: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const db = SQLite.openDatabaseSync('hostelr.db');

function nowIso() {
  return new Date().toISOString();
}

export async function initDb() {
  // Enable FK
  db.execSync('PRAGMA foreign_keys = ON;');

  // Migrations - simple idempotent schema creation
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      roomNumber TEXT,
      bedNumber TEXT,
      joinDate TEXT,
      rent INTEGER NOT NULL,
      deposit INTEGER NOT NULL,
      status TEXT NOT NULL,
      lastPayment TEXT,
      nextPaymentDue TEXT,
      address TEXT,
      emergencyContact TEXT,
      photo TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      roomNumber TEXT UNIQUE NOT NULL,
      capacity INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS beds (
      id TEXT PRIMARY KEY,
      roomId TEXT NOT NULL,
      bedNumber TEXT NOT NULL,
      isOccupied INTEGER NOT NULL DEFAULT 0,
      tenantId TEXT,
      monthlyRent INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(roomId) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY(tenantId) REFERENCES tenants(id) ON DELETE SET NULL,
      UNIQUE(roomId, bedNumber)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      tenantId TEXT NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL,
      method TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(tenantId) REFERENCES tenants(id) ON DELETE CASCADE
    );
  `);

  // Seed minimal data if empty
  const countRow = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM tenants;');
  const count = countRow?.count ?? 0;
  if (count === 0) {
    const seedNow = nowIso();
    const t1: Tenant = {
      id: randomUUID(),
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
      photo: null,
      createdAt: seedNow,
      updatedAt: seedNow
    };
    createTenant(t1);

    const t2: Tenant = {
      id: randomUUID(),
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
      photo: null,
      createdAt: seedNow,
      updatedAt: seedNow
    };
    createTenant(t2);

    // Rooms + Beds seed
    const r1: Room = { id: randomUUID(), roomNumber: 'R-101', capacity: 2, createdAt: seedNow, updatedAt: seedNow };
    const r2: Room = { id: randomUUID(), roomNumber: 'R-205', capacity: 3, createdAt: seedNow, updatedAt: seedNow };
    createRoom(r1);
    createRoom(r2);

    const b1: Bed = { id: randomUUID(), roomId: r1.id, bedNumber: 'B-1', isOccupied: 1, tenantId: t1.id, monthlyRent: 12000, createdAt: seedNow, updatedAt: seedNow };
    const b2: Bed = { id: randomUUID(), roomId: r1.id, bedNumber: 'B-2', isOccupied: 0, tenantId: null, monthlyRent: 12000, createdAt: seedNow, updatedAt: seedNow };
    const b3: Bed = { id: randomUUID(), roomId: r2.id, bedNumber: 'B-1', isOccupied: 1, tenantId: t2.id, monthlyRent: 10000, createdAt: seedNow, updatedAt: seedNow };
    const b4: Bed = { id: randomUUID(), roomId: r2.id, bedNumber: 'B-2', isOccupied: 0, tenantId: null, monthlyRent: 10000, createdAt: seedNow, updatedAt: seedNow };
    const b5: Bed = { id: randomUUID(), roomId: r2.id, bedNumber: 'B-3', isOccupied: 0, tenantId: null, monthlyRent: 10000, createdAt: seedNow, updatedAt: seedNow };
    createBed(b1); createBed(b2); createBed(b3); createBed(b4); createBed(b5);

    // Payment sample
    const p1: Payment = { id: randomUUID(), tenantId: t1.id, amount: 12000, date: '2024-01-01', method: 'UPI', notes: 'January rent', createdAt: seedNow, updatedAt: seedNow };
    createPayment(p1);
  }
}

/* Tenants CRUD */
export function listTenants(): Tenant[] {
  return db.getAllSync<Tenant>('SELECT * FROM tenants ORDER BY createdAt DESC;');
}

export function getTenant(id: UUID): Tenant | undefined {
  return db.getFirstSync<Tenant>('SELECT * FROM tenants WHERE id = ?;', [id]);
}

export function createTenant(data: Tenant): void {
  db.runSync(
    `INSERT INTO tenants (id,name,email,phone,roomNumber,bedNumber,joinDate,rent,deposit,status,lastPayment,nextPaymentDue,address,emergencyContact,photo,createdAt,updatedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      data.id, data.name, data.email, data.phone, data.roomNumber, data.bedNumber, data.joinDate, data.rent, data.deposit,
      data.status, data.lastPayment ?? null, data.nextPaymentDue ?? null, data.address ?? null, data.emergencyContact ?? null,
      data.photo ?? null, data.createdAt, data.updatedAt
    ]
  );
}

export function updateTenant(id: UUID, patch: Partial<Tenant>): void {
  const current = getTenant(id);
  if (!current) return;
  const updated: Tenant = { ...current, ...patch, updatedAt: nowIso() };
  db.runSync(
    `UPDATE tenants SET name=?,email=?,phone=?,roomNumber=?,bedNumber=?,joinDate=?,rent=?,deposit=?,status=?,lastPayment=?,nextPaymentDue=?,address=?,emergencyContact=?,photo=?,updatedAt=? WHERE id=?`,
    [
      updated.name, updated.email, updated.phone, updated.roomNumber, updated.bedNumber, updated.joinDate, updated.rent, updated.deposit,
      updated.status, updated.lastPayment ?? null, updated.nextPaymentDue ?? null, updated.address ?? null, updated.emergencyContact ?? null,
      updated.photo ?? null, updated.updatedAt, id
    ]
  );
}

export function deleteTenant(id: UUID): void {
  db.runSync('DELETE FROM tenants WHERE id = ?', [id]);
}

/* Rooms CRUD */
export function listRooms(): Room[] {
  return db.getAllSync<Room>('SELECT * FROM rooms ORDER BY roomNumber ASC;');
}

export function getRoomByNumber(roomNumber: string): Room | undefined {
  return db.getFirstSync<Room>('SELECT * FROM rooms WHERE roomNumber = ?;', [roomNumber]);
}

export function createRoom(data: Room): void {
  db.runSync(
    `INSERT INTO rooms (id, roomNumber, capacity, createdAt, updatedAt) VALUES (?,?,?,?,?)`,
    [data.id, data.roomNumber, data.capacity, data.createdAt, data.updatedAt]
  );
}

export function updateRoom(id: UUID, patch: Partial<Room>): void {
  const current = db.getFirstSync<Room>('SELECT * FROM rooms WHERE id = ?;', [id]);
  if (!current) return;
  const updated: Room = { ...current, ...patch, updatedAt: nowIso() };
  db.runSync(`UPDATE rooms SET roomNumber=?, capacity=?, updatedAt=? WHERE id=?`, [
    updated.roomNumber, updated.capacity, updated.updatedAt, id
  ]);
}

export function deleteRoom(id: UUID): void {
  db.runSync('DELETE FROM rooms WHERE id = ?', [id]);
}

/* Beds CRUD */
export function listBedsByRoom(roomId: UUID): Bed[] {
  const rows = db.getAllSync<Bed>('SELECT * FROM beds WHERE roomId = ? ORDER BY bedNumber ASC;', [roomId]);
  return rows.map((b: Bed) => ({
    ...b,
    isOccupied: Number(b.isOccupied) as any,
  }));
}

export function createBed(data: Bed): void {
  db.runSync(
    `INSERT INTO beds (id, roomId, bedNumber, isOccupied, tenantId, monthlyRent, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)`,
    [data.id, data.roomId, data.bedNumber, data.isOccupied, data.tenantId ?? null, data.monthlyRent, data.createdAt, data.updatedAt]
  );
}

export function updateBed(id: UUID, patch: Partial<Bed>): void {
  const current = db.getFirstSync<Bed>('SELECT * FROM beds WHERE id = ?;', [id]);
  if (!current) return;
  const updated: Bed = { ...current, ...patch, updatedAt: nowIso() };
  db.runSync(`UPDATE beds SET bedNumber=?, isOccupied=?, tenantId=?, monthlyRent=?, updatedAt=? WHERE id=?`, [
    updated.bedNumber, updated.isOccupied, updated.tenantId ?? null, updated.monthlyRent, updated.updatedAt, id
  ]);
}

export function deleteBed(id: UUID): void {
  db.runSync('DELETE FROM beds WHERE id = ?', [id]);
}

/* Payments CRUD */
export function listPaymentsForTenant(tenantId: UUID): Payment[] {
  return db.getAllSync<Payment>('SELECT * FROM payments WHERE tenantId = ? ORDER BY date DESC;', [tenantId]);
}

export function createPayment(data: Payment): void {
  db.runSync(
    `INSERT INTO payments (id, tenantId, amount, date, method, notes, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)`,
    [data.id, data.tenantId, data.amount, data.date, data.method, data.notes ?? null, data.createdAt, data.updatedAt]
  );
}

export function deletePayment(id: UUID): void {
  db.runSync('DELETE FROM payments WHERE id = ?', [id]);
}

/* Helpers for screens */
export function ensureRoomAndBedForTenant(tenant: Tenant) {
  // ensure room exists
  let room = getRoomByNumber(tenant.roomNumber);
  const at = nowIso();
  if (!room) {
    room = { id: randomUUID(), roomNumber: tenant.roomNumber, capacity: 1, createdAt: at, updatedAt: at };
    createRoom(room);
  }
  // ensure bed exists
  const bed = db.getFirstSync<Bed>('SELECT * FROM beds WHERE roomId = ? AND bedNumber = ?;', [room.id, tenant.bedNumber]);
  if (!bed) {
    const b: Bed = { id: randomUUID(), roomId: room.id, bedNumber: tenant.bedNumber, isOccupied: 1, tenantId: tenant.id, monthlyRent: tenant.rent, createdAt: at, updatedAt: at };
    createBed(b);
  }
}
