<template>
  <div>
    <div
      v-for="message in messages"
      v-bind:key="message.id"
      class="mb-2 bg-gray-800 shadow-lg rounded-lg overflow-hidden"
    >
      <div class="flex px-6 py-4">
        <div class="mt-4 mt-0 ml-4 text-left flex flex-1 flex-col">
          <div class="flex flex-1 items-center">
            <svg
              class="mr-2 text-red-700"
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 576 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              v-if="message.source == 'youtube'"
            >
              <path
                d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
              />
            </svg>
            <a
              class="text-sm leading-tight text-gray-200 flex-1"
              v-bind:href="message.url"
              >{{ message.username }}</a
            >
            <span class="text-xs text-gray-500">
              {{ new Date(message.date).toLocaleString() }}
            </span>
          </div>
          <div class="mt-4">
            <p class="text-base text-white">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const sortByDate = (messages) =>
  messages.sort((a, b) => new Date(b.date) - new Date(a.date))

export default {
  data() {
    return { messages: [] }
  },
  created() {
    this.socket = new WebSocket('ws://localhost:3000/api/messages')

    this.socket.onopen = (event) => {
      console.log('socket open')
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.messages) {
        this.messages = sortByDate(data.messages)
      }
      if (data.message) {
        this.messages = sortByDate(this.messages.concat(data.message))
      }
    }
  },
  beforeDestroy() {
    this.socket.close()
  }
}
</script>

<style></style>
