<template>
  <div class="flex justify-center content-center h-full">
    <form>
      <div class="flex flex-col md:w-96 font-bold">
        <div class="flex flex-col mb-4 md:mb-6 relative">
          <label for="email" class="pl-2 pb-2">
            Email
          </label>
          <input
            autocomplete
            type="email"
            id="email"
            placeholder="Your email address..."
            v-model="email"
            @blur="emailBlur"
            class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
          <span class="text-sm text-red-600 pl-2 pt-1 absolute -bottom-6 right-0" v-if="emailError">{{ emailError }}</span>
        </div>
        <div class="flex flex-col mb-8 md:mb-10 relative">
          <label for="password" class="pl-2 pb-2">
            Password
          </label>
          <input
            autocomplete
            type="password"
            id="password"
            v-model="password"
            @blur="passwordBlur"
            placeholder="Your password..."
            class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
          <span class="text-sm text-red-600 pl-2 pt-1 absolute -bottom-6 right-0" v-if="passwordError">{{ passwordError }}</span>
        </div>
      </div>
      <div class="w-full flex flex-col text-center">
        <button
          @click.prevent="authTo"
          :disabled="isSubmitting"
          class="border-2 outline-none rounded-xl py-2 px-4 mb-2.5 font-bold focus:outline-none hover:bg-gray-600 transform"
          :class="isSubmitting ? 'bg-yellow-900' : ''"
        >{{ isSubmitting ? 'Loading...' : 'Authenticate' }}</button>
        <span class="text-xs my-1 block text-white text-opacity-40 font-bold">OR</span>
        <button
          @click.prevent="$router.push('/register')"
          class="border-b border-yellow-600 pt-2 pb-1 text-sm font-bold text-yellow-600 uppercase focus:outline-none focus:border-blue-200 focus:text-blue-200 hover:bg-gray-600"
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
