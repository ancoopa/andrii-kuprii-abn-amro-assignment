export function debounce<T extends Function>(func: T, wait = 500) {
  let timer = 0
  const callable = (...args: any) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => func(...args), wait)
  }
  return <T>(<any>callable)
}
