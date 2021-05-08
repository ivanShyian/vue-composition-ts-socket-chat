<template>
  <div class="flex justify-center content-center h-full">
    <form>
      <div class="flex flex-col w-96 font-bold">
        <div class="flex flex-col mb-4">
          <label for="email" class="pl-2 pb-2">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="Your email address..."
            class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
        </div>
        <div class="flex flex-col mb-6">
          <label for="password" class="pl-2 pb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Your password..."
            class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
        </div>
      </div>
      <div class="w-full flex flex-col text-center">
        <button
          @click.prevent="authUser"
          class="border-2 outline-none rounded-xl py-2 px-4 mb-2.5 font-bold focus:outline-none hover:bg-gray-600 transform"
        >Authenticate</button>
        <span class="text-xs my-1 block text-white text-opacity-40 font-bold">OR</span>
        <button
          class="border-b border-white pt-2 pb-1 text-md text-yellow-100 focus:outline-none focus:border-blue-200 focus:text-blue-200 hover:bg-gray-600"
        >Register an account</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
export default defineComponent({
  setup() {
    const authUser = async() => {
      const res = await axios.get('http://localhost:3000/firebase')
      console.log({ res })
    }
    return {
      authUser
    }
  }
})
</script>

<style scoped>

</style>
