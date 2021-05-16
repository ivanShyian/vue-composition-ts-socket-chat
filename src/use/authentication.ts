import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export function useAuth(): any {
  const store = useStore()
  const router = useRouter()
  const { isSubmitting, handleSubmit } = useForm()
  const { errorMessage: emailError, value: email, handleBlur: emailBlur } = useField(
    'email',
    yup.string().required('Email is required').email('Wrong email')
  )
  const { errorMessage: passwordError, value: password, handleBlur: passwordBlur } = useField(
    'password',
    yup.string().required('Password is required').min(6).matches(/[a-zA-Z0-9]/, 'Password can only contain Latin letters.')
  )

  const authTo = async(): Promise<void> => {
    try {
      await store.dispatch('auth/login', {
        email: email.value,
        password: password.value
      })
      await router.push('/chats')
    } catch (e) {
      console.warn(e)
    }
  }
  return {
    email,
    password,
    emailError,
    passwordError,
    emailBlur,
    passwordBlur,
    isSubmitting,
    handleSubmit,
    authTo
  }
}
