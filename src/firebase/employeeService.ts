import {
  collection,
  addDoc,
  getDocs,
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
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Colaborador[]
}
