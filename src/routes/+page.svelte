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

<div class="container">
    <div bind:this={messagesDiv} class="messages-div overflow-y-scroll">
      <ul id="messages">
        {#each messages as message}
        <li>
            <div class="message">
              <h1>{message.user}</h1> 
              <p style="{message.style}">{message.msg}</p>
            </div></li>
        {/each}
      </ul>
    </div>
    <form class="form-div" action="#" on:submit|preventDefault={sendMessage}>
      <input bind:value={textfield} spellcheck="true" class="border-solid border-2 border-indigo-600" />
      <button class="invisible">Send</button>
    </form>
  </div>
  <ul id="messages" class="list-group"></ul>