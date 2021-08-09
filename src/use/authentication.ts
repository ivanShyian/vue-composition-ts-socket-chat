import {useField, useForm} from 'vee-validate'
import * as yup from 'yup'
import {Store, useStore} from 'vuex'
import {Router, useRouter} from 'vue-router'
import {Ref, ComputedRef, computed, nextTick} from 'vue'
import {randomId} from '@/utils/randomIdGenerator'

type VuexStore = Store<unknown>
type SubmitHandler = (e?: (Event | undefined)) => Promise<void>

interface AuthHook {
  email: Ref<string | undefined>,
  password: Ref<string | undefined>,
  nickname?: Ref<string | undefined>,
  emailError: ComputedRef<string | undefined>,
  passwordError: ComputedRef<string | undefined>,
  nicknameError: ComputedRef<string | undefined>,
  isSubmitting: Ref<boolean>,
  emailBlur: (e?: Event) => void,
  passwordBlur: (e?: Event) => void,
  nicknameBlur: (e?: Event) => void,
  authTo: SubmitHandler,
  registerTo: SubmitHandler
}

export function useAuth(isRegister?: boolean): AuthHook {
  const store: VuexStore = useStore()
  const router: Router = useRouter()
  const authStatus = computed(() => store.getters['auth/authStatus'])

  const {isSubmitting, handleSubmit, resetForm} = useForm()
  const {errorMessage: emailError, value: email, handleBlur: emailBlur} = useField(
    'email',
    yup.string().required('Email is required').email('Wrong email')
  )
  const {errorMessage: passwordError, value: password, handleBlur: passwordBlur} = useField(
    'password',
    yup.string().required('Password is required').min(6, 'Required 6 characters minimum').matches(/[a-zA-Z0-9]/, 'Password can only contain Latin letters.')
  )

  const {errorMessage: nicknameError, value: nickname, handleBlur: nicknameBlur} = useField(
    'nickname',
    isRegister
      ? yup.string().required('Nickname is required').min(2).matches(/[a-zA-Z0-9]/, 'Nickname can only contain Latin letters.')
      : yup.string().trim()
  )

  const authTo = handleSubmit(async(): Promise<void> => {
    await store.dispatch('auth/login', {
      email: email.value,
      password: password.value
    })
    if (authStatus.value.success) {
      resetForm()
      await router.push('/chats')
    }
  })

  const registerTo = handleSubmit(async(): Promise<void> => {
    await store.dispatch('auth/register', {
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      id: randomId()
    })
    if (authStatus.value.success) {
      resetForm()
      await router.push('/chats')
    }
  })

  return {
    email,
    password,
    nickname,
    emailError,
    passwordError,
    emailBlur,
    passwordBlur,
    isSubmitting,
    nicknameError,
    nicknameBlur,
    authTo,
    registerTo
  }
}
