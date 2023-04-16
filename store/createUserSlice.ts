import { StateCreator } from 'zustand'

export interface UserSlice {
  user: {
    remainingMinutes: number
  }
  ui: {
    showSignInModal: boolean
  }
  showSignIn: (show: boolean) => void
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: { remainingMinutes: 0 },
  ui: {
    showSignInModal: false,
  },
  showSignIn: (show) =>
    set({
      ui: {
        showSignInModal: show,
      },
    }),
})
