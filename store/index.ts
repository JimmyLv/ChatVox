import { create } from 'zustand'
import { createFileSlice, FileSlice } from './createFileSlice'
import { createUserSlice, UserSlice } from './createUserSlice'

type StoreState = UserSlice & FileSlice

export const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createFileSlice(...a),
}))
