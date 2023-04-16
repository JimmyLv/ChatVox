// mock for next-export-i18n
export function useTranslation() {
  return {
    t: (key: string) => key,
  }
}
