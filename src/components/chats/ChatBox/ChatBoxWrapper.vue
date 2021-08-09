<template>
  <div
    class="flex flex-auto border border-opacity-30
    border-gray-800 dark:border-gray-500 rounded-md bg-gray-100 dark:bg-transparent overflow-hidden h-full"
  >
    <slot name="main"/>
    <slot name="sidebar"/>
  </div>
</template>
