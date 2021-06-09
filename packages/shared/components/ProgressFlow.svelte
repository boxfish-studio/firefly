<script lang="typescript">
    export let steps = []
    export let classes = ''
</script>

<style type="text/scss">
    .completed {
        @apply relative;
        @apply border-0;
        @apply text-white;
        @apply bg-blue-500;
    }
    .current-step {
        @apply w-8;
        @apply h-8;
        @apply text-white;
        @apply bg-blue-500;
    }
    .current-title {
        @apply text-gray-800;
    }
</style>

<div class={`flex flex-row items-center ${classes}`}>
    {#each steps as step, index}
        <div class="flex flex-col items-center justify-around w-full">
            <div class="flex items-center justify-center w-8 h-8">
                <div
                    class="w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-gray-500 flex items-center justify-center"
                    class:completed={step.completed}
                    class:current-step={steps[index - 1] ? steps[index - 1].completed && !steps[index].completed : false}>
                    {#if !step.completed}{index + 1}{/if}
                </div>
                {#if step.completed}
                    <svg class="absolute" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.727 0.313379C11.1062 0.714897 11.0881 1.3478 10.6866 1.72702L3.98009 7.8943L0.292893 4.20711C-0.0976311 3.81659 -0.0976311 3.18342 0.292893 2.7929C0.683417 2.40237 1.31658 2.40237 1.70711 2.7929L4.01991 5.1057L9.31338 0.272989C9.71489 -0.106222 10.3478 -0.0881392 10.727 0.313379Z"
                            fill="#F6F9FF" />
                    </svg>
                {/if}
            </div>
            <div class="h-12">
                <div
                    class="text-gray-500 px-2 py-4 text-10"
                    class:current-title={steps[index - 1] ? steps[index - 1].completed && !steps[index].completed : false}>
                    {step.title}
                </div>
            </div>
        </div>
    {/each}
</div>
