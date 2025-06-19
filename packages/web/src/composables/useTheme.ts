// these APIs are auto-imported from @vueuse/core
export default function useTheme() {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  return {
    isDark,
    toggleDark
  }
}
