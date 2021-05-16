<template>
  <form>
    <div class="flex flex-col w-96 font-bold">
      <div class="flex flex-col mb-4">
        <label for="f-l-Name" class="pl-2 pb-2">
          First and Last name
        </label>
        <input
          type="text"
          id="f-l-Name"
          placeholder="Your email address..."
          class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
      </div>
      <div class="flex flex-col mb-4">
        <label for="nickname" class="pl-2 pb-2">
          Nickname
        </label>
        <input
          type="text"
          id="nickname"
          placeholder="Your nickname..."
          class="outline-none py-1.5 px-3 rounded-xl bg-blue-100 focus:ring-2 focus:ring-yellow-600 text-blue-900">
      </div>
      <div class="flex flex-col mb-4">
        <label for="r-email" class="pl-2 pb-2">
          Email
        </label>
        <input
          type="email"
          id="r-email"
          placeholder="Your email..."
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
        class="border-2 outline-none rounded-xl py-2 px-4 mb-2.5 font-bold focus:outline-none hover:bg-gray-600 transform"
      >Register</button>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  setup() {
    return {}
  }
}
</script>

<style scoped>

</style>
