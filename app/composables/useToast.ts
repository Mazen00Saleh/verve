export type ToastType = 'success' | 'error'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

export function useToast() {
  const toasts = useState<ToastMessage[]>('admin-toasts', () => [])

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  function show(message: string, type: ToastType = 'success') {
    const id = crypto.randomUUID()
    toasts.value = [...toasts.value, { id, message, type }]

    setTimeout(() => {
      dismiss(id)
    }, 4000)
  }

  function success(message: string) {
    show(message, 'success')
  }

  function error(message: string) {
    show(message, 'error')
  }

  return {
    toasts,
    show,
    success,
    error,
    dismiss,
  }
}
