<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <Sidebar />

    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>


