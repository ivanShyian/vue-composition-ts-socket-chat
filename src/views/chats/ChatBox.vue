<template>
  <div class="hidden md:flex mb-24 flex-auto border border-opacity-30 border-gray-800 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-transparent overflow-hidden">
    <div class="flex md:flex-col md:justify-between flex-auto">
      <div class="border-b border-gray-700 px-2 py-3 bg-gray-800 flex justify-between">
        <span>Ivan Shyian</span>
        <span class="text-gray-500 text-sm">was online 1 hour ago</span>
      </div>
      <div class="h-full bg-gray-600 px-2 py-3">Messages</div>
      <div class="border-t border-gray-700 px-2 py-3 bg-gray-800">
        <div class="flex">
          <input type="text" class="border-b border-l border-gray-500 h-8 w-full pl-5 pr-20 rounded-bl-md bg-transparent focus:shadow-lg  focus:outline-none focus:border-gray-400 focus:text-gray-200" placeholder="Start typing message...">
          <button class="h-8 w-20 text-white rounded-sm bg-gray-600 hover:bg-gray-700 focus:outline-none">Send</button>
        </div>
      </div>
    </div>
    <div v-show="false" class="flex flex-col px-2 py-5 bg-gray-800 border-l border-gray-700">
      <div class="flex flex-col items-center border-b border-gray-400 border-opacity-10 pb-3 mb-3">
        <div class="rounded-full overflow-hidden border border-gray-700 w-1/2 h-auto mb-3">
          <img src="../../assets/logo.png" alt="">
        </div>
        <p class="text-lg">Name of user</p>
      </div>
      <div class="mx-auto pt-10 text-gray-700 font-medium">Coming soon...</div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>

</style>
