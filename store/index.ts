import { create } from 'zustand'
import { createFileSlice, FileSlice } from './createFileSlice'
import { createUserSlice, UserSlice } from './createUserSlice'
import { createVideoSlice, VideoSlice } from './createVideoSlice'

type StoreState = UserSlice & FileSlice & VideoSlice

export const useAppStore = create<StoreState>()((...a) => ({
  ...createUserSlice(...a),
  ...createFileSlice(...a),
  ...createVideoSlice(...a),
}))
