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
            <svg
              class="mr-2 text-indigo-700"
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              v-if="message.source == 'twitch'"
            >
              <path
                d="M40.1 32L10 108.9v314.3h107V480h60.2l56.8-56.8h87l117-117V32H40.1zm357.8 254.1L331 353H224l-56.8 56.8V353H76.9V72.1h321v214zM331 149v116.9h-40.1V149H331zm-107 0v116.9h-40.1V149H224z"
              ></path>
            </svg>
            <svg
              class="mr-2"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              height="1em"
              width="1em"
              viewBox="0 0 512 512"
              style="enable-background:new 0 0 512 512;"
              xml:space="preserve"
              v-if="message.source == 'mixer'"
            >
              <style type="text/css">
                .st0 {
                  fill: #03214f;
                }
                .st1 {
                  fill: #1fbaed;
                }
              </style>
              <path
                class="st0"
                d="M116.03,77.68c-15.76-21.29-46.72-24.61-66.91-6.36c-17.42,16.04-18.8,43.13-4.7,62.21l90.96,121.92
	L43.87,378.48c-14.1,19.08-12.99,46.17,4.7,62.21c20.18,18.25,51.15,14.93,66.91-6.36l127.73-171.69c3.04-4.15,3.04-9.95,0-14.1
	L116.03,77.68z"
              />
              <path
                class="st1"
                d="M396.37,77.68c15.76-21.29,46.72-24.61,66.91-6.36c17.42,16.04,18.8,43.13,4.7,62.21l-90.96,121.92
	l91.51,123.03c14.1,19.08,12.99,46.17-4.7,62.21c-20.18,18.25-51.15,14.93-66.91-6.36L269.47,262.36c-3.04-4.15-3.04-9.95,0-14.1
	L396.37,77.68z"
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
        return
      }

      this.messages = sortByDate(this.messages.concat(data))
    }
  },
  beforeDestroy() {
    this.socket.close()
  }
}
</script>

<style></style>
