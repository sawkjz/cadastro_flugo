import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import type { Departamento } from '../types/department'

export async function saveDepartamento(
  data: Omit<Departamento, 'id' | 'criadoEm'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, 'departamentos'), {
    ...data,
    criadoEm: serverTimestamp(),
  })
  return docRef.id
}

export async function getDepartamentos(): Promise<Departamento[]> {
  const q = query(collection(db, 'departamentos'), orderBy('criadoEm', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Departamento[]
}

export async function getDepartamentoById(id: string): Promise<Departamento | null> {
  const docRef = doc(db, 'departamentos', id)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Departamento
}

export async function updateDepartamento(
  id: string,
  data: Partial<Omit<Departamento, 'id' | 'criadoEm'>>,
): Promise<void> {
  const docRef = doc(db, 'departamentos', id)
  await updateDoc(docRef, data)
}

export async function deleteDepartamento(id: string): Promise<void> {
  const docRef = doc(db, 'departamentos', id)
  await deleteDoc(docRef)
}
