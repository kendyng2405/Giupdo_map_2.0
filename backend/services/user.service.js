import { admin, db, auth } from '../config/firebase.js';

const RANKS = [
  { name: "Đồng Lòng",     minPoints: 0,  color: "#CD7F32", next: 5  },
  { name: "Tấm Lòng Bạc",  minPoints: 5,  color: "#A8B8C8", next: 15 },
  { name: "Vàng Tâm",      minPoints: 15, color: "#FFD700", next: 30 },
  { name: "Trái Tim Vàng", minPoints: 30, color: "#FF8C00", next: null },
];

export const getRankByPoints = (points) => {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (points >= RANKS[i].minPoints) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
    }
  }
  return { currentRank, nextRank };
};

export const create = async (uid, data) => {
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();
  if (doc.exists) {
    throw new Error('User already exists');
  }
  
  const userData = {
    email: data.email,
    fullName: data.fullName,
    phone: data.phone || '',
    role: 'member',
    points: 0,
    supportedLocations: [],
    photoURL: '',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await userRef.set(userData);
  return { id: uid, ...userData };
};

export const findById = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  const data = doc.data();
  const points = data.points || 0;
  const { currentRank, nextRank } = getRankByPoints(points);
  
  // Calculate progress towards next rank
  let progress = 100;
  let pointsToNext = 0;
  if (nextRank) {
    const rangeTotal = nextRank.minPoints - currentRank.minPoints;
    const rangeDone = points - currentRank.minPoints;
    progress = Math.round((rangeDone / rangeTotal) * 100);
    pointsToNext = nextRank.minPoints - points;
  }
  
  return {
    id: doc.id,
    ...data,
    rankInfo: { currentRank, nextRank },
    rank: {
      name: currentRank.name,
      color: currentRank.color,
      minPoints: currentRank.minPoints,
      progress,
      pointsToNext,
      next: nextRank ? { name: nextRank.name, color: nextRank.color, minPoints: nextRank.minPoints } : null
    }
  };
};

export const update = async (uid, data) => {
  const userRef = db.collection('users').doc(uid);
  await userRef.update(data);
  const doc = await userRef.get();
  return { id: uid, ...doc.data() };
};

export const addSupportedLocation = async (uid, locationId) => {
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();
  if (!doc.exists) return;
  
  const data = doc.data();
  const supportedLocations = data.supportedLocations || [];
  
  if (!supportedLocations.includes(locationId)) {
    await userRef.update({
      supportedLocations: admin.firestore.FieldValue.arrayUnion(locationId),
      points: admin.firestore.FieldValue.increment(1)
    });
  }
};

export const getLeaderboard = async (limit = 10) => {
  const snapshot = await db.collection('users')
    .orderBy('points', 'desc')
    .limit(limit)
    .get();
    
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const { currentRank } = getRankByPoints(data.points || 0);
    return {
      id: doc.id,
      fullName: data.fullName,
      photoURL: data.photoURL,
      points: data.points,
      rankInfo: getRankByPoints(data.points || 0),
      rank: {
        name: currentRank.name,
        color: currentRank.color
      }
    };
  });
};

export const getAll = async () => {
  const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProfile = async (uid, { fullName, phone }) => {
  return update(uid, { fullName, phone });
};

export const deleteUser = async (uid) => {
  // Xóa tài khoản Auth
  await auth.deleteUser(uid);
  // Xóa document trong Firestore
  await db.collection('users').doc(uid).delete();
};

export const setRole = async (uid, role) => {
  return update(uid, { role });
};
