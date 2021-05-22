<template>
  <form>
    <div class="flex flex-col w-96 font-bold">
      <div class="flex flex-col mb-1">
        <label for="nickname" class="pl-2 pb-2">
          Nickname
        </label>
        <input
          type="text"
          id="nickname"
          autocomplete
          placeholder="Your nickname..."
          @blur="nicknameBlur"
          v-model="nickname"
          class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900 mb-0.5">
        <span class="py-2.5" v-if="!nicknameError"></span>
        <span class="text-sm text-red-600 pl-2 pt-1" v-else>{{ nicknameError }}</span>
      </div>
      <div class="flex flex-col mb-1">
        <label for="r-email" class="pl-2 pb-2">
          Email
        </label>
        <input
          autocomplete
          type="email"
          id="r-email"
          placeholder="Your email address..."
          @blur="emailBlur"
          v-model="email"
          class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900 mb-0.5">
        <span class="py-2.5" v-if="!emailError"></span>
        <span class="text-sm text-red-600 pl-2 pt-1" v-else>{{ emailError }}</span>
      </div>
      <div class="flex flex-col mb-3">
        <label for="password" class="pl-2 pb-2">
          Password
        </label>
        <input
          autocomplete
          type="password"
          id="password"
          placeholder="Your password..."
          @blur="passwordBlur"
          v-model="password"
          class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900 mb-0.5">
        <span class="py-2.5" v-if="!passwordError"></span>
        <span class="text-sm text-red-600 pl-2 pt-1" v-else>{{ passwordError }}</span>
      </div>
    </div>
    <div class="w-full flex flex-col text-center">
      <button
        @click.prevent="registerTo"
        class="border-2 outline-none rounded-xl py-2 px-4 mb-2.5 font-bold focus:outline-none hover:bg-gray-600 transform"
      >{{ isSubmitting ? 'Loading...' : 'Register' }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { useAuth } from '@/use/authentication'

export default {
  setup() {
    return {
      ...useAuth(true)
    }
  }
}
</script>

<style scoped>

</style>
