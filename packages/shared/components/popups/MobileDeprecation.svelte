<script lang="typescript">
    import { Text } from 'shared/components'
</script>

<div class="flex flex-col space-y-5 text-center">
    <Text type="h4" classes="text-center">This is a title</Text>
    <div class="flex flex-auto flex-grow justify-center items-center">
        <Text type="p">This is a body text</Text>
    </div>
</div>

<style lang="scss">
    div {
        min-height: 80vh;
    }
</style>
