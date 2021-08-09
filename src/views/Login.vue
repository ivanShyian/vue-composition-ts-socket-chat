<template>
  <div class="border-2 rounded-lg px-6 pb-4 pt-6 bg-white dark:bg-transparent md:py-8 md:px-12 modal-shadow flex justify-center content-center h-full">
    <form>
      <div class="flex flex-col w-60 md:w-96 font-bold">
        <div class="flex flex-col mb-4 md:mb-6 relative">
          <label for="email" class="text-sm text-gray-500 dark:text-white md:text-base pl-2 pb-2">
            Email
          </label>
          <input
            autocomplete
            type="email"
            id="email"
            placeholder="Your email address..."
            v-model="email"
            @blur="emailBlur"
            class="outline-none py-1.5 px-3 rounded-md border border-gray-300 dark:border-transparent md:rounded-xl bg-white dark:bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
          <span class="text-xs md:text-sm text-red-600 pl-2 pt-1 absolute -bottom-6 right-0" v-if="emailError">{{ emailError }}</span>
        </div>
        <div class="flex flex-col mb-8 md:mb-10 relative">
          <label for="password" class="text-sm text-gray-500 dark:text-white md:text-base pl-2 pb-2">
            Password
          </label>
          <input
            autocomplete
            type="password"
            id="password"
            v-model="password"
            @blur="passwordBlur"
            placeholder="Your password..."
            class="outline-none py-1.5 px-3 rounded-md md:rounded-xl border border-gray-300 dark:border-transparent bg-white dark:bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
          <span class="text-xs md:text-sm whitespace-nowrap text-red-600 pl-2 pt-1 absolute -bottom-6 right-0" v-if="passwordError">{{ passwordError }}</span>
        </div>
      </div>
      <div class="w-full flex flex-col text-center">
        <button
          @click.prevent="authTo"
          :disabled="isSubmitting"
          class="border-2 outline-none rounded-md md:rounded-xl py-1 px-2 md:py-2 md:px-4 mb-2.5 font-bold bg-emerald-50 dark:bg-transparent focus:bg-emerald-200 dark:focus:bg-transparent focus:outline-none hover:bg-gray-600 transform"
          :class="isSubmitting ? 'bg-yellow-900' : ''"
        >{{ isSubmitting ? 'Loading...' : 'Authenticate' }}</button>
        <span class="text-xs my-1 block text-white text-opacity-40 font-bold">OR</span>
        <button
          @click.prevent="$router.push('/register')"
          class="border-b border-yellow-500 pt-2 pb-1 text-xs md:text-sm font-bold text-yellow-500 uppercase focus:outline-none hover:bg-emerald-100 focus:bg-emerald-100 dark:focus:border-blue-200 dark:focus:text-blue-200 dark:hover:bg-gray-600"
        >Register an account</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useAuth} from '@/use/authentication'

export default defineComponent({
  setup() {
    return {
      ...useAuth()
    }
  }
})
</script>

<style scoped>

</style>
