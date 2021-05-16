<template>
  <div class="flex justify-center content-center h-full">
    <form>
      <div class="flex flex-col md:w-96 font-bold">
        <div class="flex flex-col mb-1 md:mb-2">
          <label for="email" class="pl-2 pb-2">
            Email
          </label>
          <input
            autocomplete
            type="text"
            id="email"
            placeholder="Your email address..."
            v-model="email"
            class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
          <span class="py-2.5" v-if="!emailError"></span>
          <span class="text-sm text-red-600 pl-2 pt-1">{{ emailError }}</span>
        </div>
        <div class="flex flex-col mb-2 md:mb-4">
          <label for="password" class="pl-2 pb-2">
            Password
          </label>
          <input
            autocomplete
            type="password"
            id="password"
            v-model="password"
            placeholder="Your password..."
            class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
          <span class="py-2.5" v-if="!passwordError"></span>
          <span class="text-sm text-red-600 pl-2 pt-1">{{ passwordError }}</span>
        </div>
      </div>
      <div class="w-full flex flex-col text-center">
        <button
          @click.prevent="authTo"
          :disabled="isSubmitting"
          class="border-2 outline-none rounded-xl py-2 px-4 mb-2.5 font-bold focus:outline-none hover:bg-gray-600 transform"
        >Authenticate</button>
        <span class="text-xs my-1 block text-white text-opacity-40 font-bold">OR</span>
        <button
          @click.prevent="$router.push('/registration')"
          class="border-b border-yellow-600 pt-2 pb-1 text-sm font-bold text-yellow-600 uppercase focus:outline-none focus:border-blue-200 focus:text-blue-200 hover:bg-gray-600"
        >Register an account</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@/use/authentication'

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
