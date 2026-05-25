<script lang="ts">
  import type { Messages } from '$lib/data/site';

  type Props = {
    messages: Messages;
  };

  let { messages }: Props = $props();
</script>

<footer>
  <div class="footer-inner">
    <span>{messages.text.footer}</span>
  </div>
</footer>
