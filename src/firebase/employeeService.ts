import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import type { Colaborador } from '../types/employee'

export async function saveColaborador(
  data: Omit<Colaborador, 'id' | 'criadoEm'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, 'colaboradores'), {
    ...data,
    criadoEm: serverTimestamp(),
  })
  return docRef.id
}

export async function getColaboradores(): Promise<Colaborador[]> {
  const q = query(collection(db, 'colaboradores'), orderBy('criadoEm', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Colaborador[]
}

export async function getColaboradorById(id: string): Promise<Colaborador | null> {
  const docRef = doc(db, 'colaboradores', id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Colaborador
}

export async function updateColaborador(
  id: string,
  data: Partial<Omit<Colaborador, 'id' | 'criadoEm'>>,
): Promise<void> {
  const docRef = doc(db, 'colaboradores', id)
  await updateDoc(docRef, data)
}

export async function deleteColaborador(id: string): Promise<void> {
  const docRef = doc(db, 'colaboradores', id)
  await deleteDoc(docRef)
}

export async function deleteColaboradores(ids: string[]): Promise<void> {
  const batch = writeBatch(db)
  ids.forEach((itemId) => {
    batch.delete(doc(db, 'colaboradores', itemId))
  })
  await batch.commit()
}
