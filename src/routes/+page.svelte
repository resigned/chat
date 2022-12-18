<script>
    import { io } from "$lib/realtime";
    import { afterUpdate, tick, onMount} from "svelte";

    let messages = []
    let textfield = ""
    let typingUsers = []

    onMount(() => {
        io.on('message', (data) => {
            addMessage(data)
        })
        io.on('join', (data) => {
          addMessage(data)
        })
        io.on('leave', (data) => {
          addMessage(data)
        })
        io.on('typing', (typing) => {
          //console.log(typing.user + " is currently typing: " + typing.typing)
          if(typing.typing){
            if(typingUsers.indexOf(typing.user) == -1){
              typingUsers.push(typing.user)
            }
            typingUsers = typingUsers
          } else {
            typingUsers = typingUsers.filter(user => user == typing.name)
          }
        })
    })



    const addMessage = (message) => {
      if(messages.length > 100){
                messages.shift()
      }
      messages = [...messages, message]
    }

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

    let typing;
    let typingTimeout;

    const doneTyping = () => {
      io.emit('typing', { typing: false })
      typing = false
    }

    afterUpdate(() => {
		  if(messages) scrollToBottom(messagesDiv);
    });

    const handleKeydown = (event) => {
      if(!typing){
        io.emit('typing', { typing: true })
        typing = true;
        typingTimeout = setTimeout(doneTyping, 750)
      } else {
        if(typingTimeout != undefined) clearTimeout(typingTimeout)
        typingTimeout = setTimeout(doneTyping, 750)
      }
    }

	
	  $: if(messages && messagesDiv) {
		scrollToBottom(messagesDiv);
	  }


</script>

<div class="md:container md:mx-auto min-w-full w-screen h-screen flex items-center justify-center">
  <div class="flex flex-col w-5/6 h-5/6 gap-y-1">
    <h1 class="text-center text-4xl">Chat</h1>
    <div bind:this={messagesDiv} class="grow overflow-y-auto font-sans break-words">
      {#each messages as message}
        {#if message.type == "message"}
        <div>
          <h1 class="font-medium">{message.user}</h1> 
          <p>{message.msg}</p>
        </div>
        {:else if message.type == "join"}
        <div>
          <p class="text-emerald-400">{message.user} {message.msg}</p>
        </div>
        {:else if message.type == "leave"}
        <div>
          <p class="text-red-400">{message.user} {message.msg}</p>
        </div>
        {/if}
      {/each}
    </div>
    <div>
      {#if typingUsers.length == 0}
      <p class="invisible">Typing</p>
      {:else }
      <p class="overflow-y-auto animate-pulse">
        {#if typingUsers.length == 1}
          {typingUsers[0]} is typing...
        {:else}
          {#each typingUsers as typingUser, i}
            {#if i == 0}
              {typingUser}
            {:else}
              , {typingUser}
            {/if}
          {/each} are typing...
        {/if}
      </p>
      {/if}
    </div>
    <form class="h-12" action="#" on:submit|preventDefault={sendMessage}>
      <input on:keydown={handleKeydown} bind:value={textfield} spellcheck="true" class="border-solid border-2 w-full rounded-md" />
      <button class="invisible">Send</button>
    </form>
  </div>
</div>