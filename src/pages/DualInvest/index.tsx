import { useEffect } from 'react'
import { Box } from '@mui/material'
// import antimatterBlackCircle from 'assets/svg/antimatter_circle_black.svg'
// import { Progress, SimpleProgress } from 'components/Progress'
import { usePrice } from 'hooks/usePriceSet'
import ProductTable from './ProductTable'
import { useProductList, useStatistics } from 'hooks/useDualInvestData'
import ProductBanner from 'components/ProductBanner'

export default function DualInvest() {
  const productList = useProductList()
  const statistics = useStatistics()
  const BTCPrice = usePrice('BTC')

  useEffect(() => {
    const el = document.getElementById('dualInvestGuide')
    if (!el) return
    const redirect = () => {
      window.open('https://docs.antimatter.finance/antimatter-dual-investment/rules', '_blank')
    }
    el.addEventListener('click', redirect)
    return () => {
      el.removeEventListener('click', redirect)
    }
  })

  return (
    <Box
      display="grid"
      justifyItems={{ xs: 'flex-start', md: 'center' }}
      width="100%"
      alignContent="flex-start"
      marginBottom="auto"
      gap={{ xs: 36, md: 48 }}
    >
      <ProductBanner
        title="Dual Investment"
        checkpoints={['Earn fixed yield on idle assets', 'Earn on both ups and downs']}
        val1={
          statistics && BTCPrice
            ? (+statistics.totalBtcDeposit * +BTCPrice + +statistics.totalUsdtDeposit).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : '-'
        }
        subVal1={'Cumulative Deposit Amount'}
        unit1={'USDT'}
        val2={
          statistics
            ? (+statistics.totalInvestAmount).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : '-'
        }
        subVal2={'Cumulative Investment Amount'}
        unit2={'USDT'}
      />
      <ProductTable strikeCurrencySymbol="BTC" productList={productList} />
    </Box>
  )
}

// function CastValue({ unit, val, total }: { unit: string; val: number; total: number }) {
//   const isDownMd = useBreakpoint('md')
//   const percentage = ((val / total) * 100).toFixed(2)

//   if (isDownMd) {
//     return (
//       <RowStr>
//         {percentage}% {val} {unit} / {total} {unit}
//       </RowStr>
//     )
//   }
//   return <Progress unit={unit} val={val} total={total} />
// }
