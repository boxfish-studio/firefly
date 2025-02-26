<script lang="ts">
    import { KeyValueBox } from 'shared/components'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { activeProfile, getBaseToken } from '@core/profile'
    import { Activity, formatTokenAmountPrecise } from '@core/wallet'
    import { ExplorerEndpoint } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { openUrlInBrowser } from '@core/app'
    import { IKeyValueBoxList, truncateString } from '@core/utils'
    import { setClipboard } from '@core/utils'

    export let activity: Activity

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    $: expirationTime = getFormattedTimeStamp(activity?.asyncData?.expirationDate)
    $: claimedTime = getFormattedTimeStamp(activity?.asyncData?.claimedDate)
    $: hasStorageDeposit =
        activity?.storageDeposit || (activity?.storageDeposit === 0 && activity?.giftedStorageDeposit === 0)
    $: gasBudget = activity?.parsedLayer2Metadata?.gasBudget

    $: formattedTransactionTime = getFormattedTimeStamp(activity?.time)
    $: formattedTimelockDate = getFormattedTimeStamp(activity?.asyncData?.timelockDate)
    $: formattedStorageDeposit = formatTokenAmountPrecise(activity?.storageDeposit ?? 0, getBaseToken())
    $: formattedGiftedStorageDeposit = formatTokenAmountPrecise(activity?.giftedStorageDeposit ?? 0, getBaseToken())
    $: formattedSurplus = formatTokenAmountPrecise(activity?.surplus ?? 0, getBaseToken())
    $: formattedGasBudget = formatTokenAmountPrecise(Number(gasBudget ?? 0), getBaseToken())

    let transactionDetailsList: IKeyValueBoxList
    $: transactionDetailsList = {
        ...(activity?.destinationNetwork && {
            destinationNetwork: { data: activity?.destinationNetwork },
        }),
        ...(activity?.time && {
            transactionTime: { data: formattedTransactionTime },
        }),
        ...(activity?.tag && {
            tag: { data: activity?.tag, isTooltipVisible: true },
        }),
        ...(activity?.metadata && {
            metadata: { data: activity?.metadata, isTooltipVisible: true },
        }),
        ...(hasStorageDeposit && {
            storageDeposit: { data: formattedStorageDeposit, isTooltipVisible: true },
        }),
        ...(activity?.surplus && {
            surplus: { data: formattedSurplus },
        }),
        ...(activity?.giftedStorageDeposit && {
            giftedStorageDeposit: { data: formattedGiftedStorageDeposit, isTooltipVisible: true },
        }),
        ...(gasBudget && {
            gasBudget: { data: formattedGasBudget, isTooltipVisible: true },
        }),
        ...(expirationTime && {
            expirationTime: { data: expirationTime, isTooltipVisible: true },
        }),
        ...(activity?.asyncData?.timelockDate && {
            timelockDate: { data: formattedTimelockDate, isTooltipVisible: true },
        }),
        ...(claimedTime && { claimedTime: { data: claimedTime } }),
    }

    function onTransactionIdClick(): void {
        explorerUrl
            ? openUrlInBrowser(
                  `${explorerUrl}/${ExplorerEndpoint.Transaction}/${activity?.asyncData?.claimingTransactionId}`
              )
            : setClipboard(activity?.asyncData?.claimingTransactionId)
    }
</script>

{#each Object.entries(transactionDetailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`general.${key}`)}
        valueText={value.data}
        tooltipText={value.isTooltipVisible
            ? localize(`tooltips.transactionDetails.${activity?.direction}.${key}`)
            : undefined}
    />
{/each}
{#if activity?.asyncData?.claimingTransactionId}
    <KeyValueBox keyText={localize(activity?.asyncData?.isClaiming ? 'general.claimingIn' : 'general.claimedIn')}>
        <button
            slot="value"
            class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
            on:click={onTransactionIdClick}
        >
            {truncateString(activity?.asyncData?.claimingTransactionId, 12, 12)}
        </button>
    </KeyValueBox>
{/if}
