<script>
    import { io } from "$lib/realtime";
    import { afterUpdate, tick, onMount} from "svelte";

    let messages = []
    let textfield = ""

    onMount(() => {
        io.on('message', (data) => {
            if(messages.length > 100){
                messages.shift()
            }
            messages = [...messages, data]
        })
    })

    const sendMessage = () => {
        const message = textfield.trim();
        if(!message) return;

        textfield = "";
        io.emit('message', message);
    }

    let messagesDiv
    const scrollToBottom = async (node) => {
        node.scroll({ top: node.scrollHeight, behavior: 'smooth' })
    }

    afterUpdate(() => {
		if(messages) scrollToBottom(messagesDiv);
    });
	
	$: if(messages && messagesDiv) {
		scrollToBottom(messagesDiv);
	}


</script>

<div class="md:container md:mx-auto min-w-full w-screen h-screen flex items-center justify-center">
  <div class="flex flex-col w-5/6 h-5/6 gap-y-5">
    <h1 class="text-center text-4xl">Chat</h1>
    <div bind:this={messagesDiv} class="grow overflow-y-auto font-sans break-words">
      {#each messages as message}
        <div>
          <h1 class="font-medium">{message.user}</h1> 
          <p>{message.msg}</p>
        </div>
      {/each}
    </div>
    <form class="h-12" action="#" on:submit|preventDefault={sendMessage}>
      <input bind:value={textfield} spellcheck="true" class="border-solid border-2 w-full rounded-md" />
      <button class="invisible">Send</button>
    </form>
  </div>
</div>