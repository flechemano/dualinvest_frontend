import { useMemo, useState, useCallback, ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Box, useTheme, styled } from '@mui/material'
import MgmtPage from 'components/MgmtPage'
import { routes } from 'constants/routes'
import { Subject } from 'components/MgmtPage/stableContent'
import { feeRate } from 'constants/index'
import VaultConfirmModal from './VaultConfirmModal'
import TextButton from 'components/Button/TextButton'
import { vaultPolicyCall, vaultPolicyPut, valutPolicyTitle, vaultPolicyText } from 'components/MgmtPage/stableContent'
import VaultForm from './VaultForm'
import { useSingleRecurProcuct } from 'hooks/useRecurData'
import DualInvestChart, { PastAggrChart } from 'pages/DualInvestMgmt/Chart'
import Card from 'components/Card/Card'

export const StyledUnorderList = styled('ul')(({ theme }) => ({
  paddingLeft: '14px',
  margin: '-20px 0 0',
  color: '#808080',
  '& li': {
    marginTop: 20,
    fontSize: 16,
    lineHeight: '20px'
  },
  '& li span': {
    color: '#252525'
  },
  '& li::marker': {
    color: theme.palette.primary.main
  }
}))

export default function RecurringValueMgmt() {
  const theme = useTheme()
  const { currency, type } = useParams<{ currency: string; type: string }>()
  const product = useSingleRecurProcuct(currency ?? '', type ?? '')

  const strikePrice = product?.strikePrice ?? '-'

  const confirmData = useMemo(
    () => ({
      ['Platform service fee']: feeRate,
      ['Spot Price']: '59,000 USDT',
      ['APY']: '140.25%',
      ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      ['Delivery Date']: '29 Oct 2021'
      // ['Spot Price']: product?.currentPrice ?? '-' + ' USDT',
      // ['APY']: product?.apy ? (+product.apy * 100).toFixed(2) + '%' : '- %',
      // ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      // ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') + ' 08:30:00 AM UTC' : '-'
    }),
    [product]
  )

  const returnOnInvestmentListItems = useMemo(() => {
    return [
      <>
        When the final settlement price ≥ 62,800 USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>
          (Subscription Amount * Strike Price) * [1 + (APY % * Period (days) / 365)]
        </span>
        .
      </>,
      <>
        When the settlement price is &lt; 62,800 USDT, you will receive{' '}
        <span style={{ color: theme.palette.text.primary }}>
          Subscription Amount * [1 + (APY% * Period (days) / 365)]
        </span>
        .
      </>,
      <>
        APY will be refreshed instantly, and Antimatter will use and lock in the latest APY when you successfully
        complete the subscription.
      </>
    ]
  }, [theme.palette.text.primary])

  const chart = useMemo(() => {
    return (
      <DualInvestChart
        product={product}
        str1={`Settlement Price ≥ ${strikePrice} USDT, will be exercised`}
        str2={`Settlement Price < ${strikePrice} USDT, will not be exercised`}
      />
    )
  }, [product, strikePrice])

  const chart2 = useMemo(() => {
    return <PastAggrChart />
  }, [])

  return (
    <>
      <VaultConfirmModal confirmData={confirmData} />

      <MgmtPage
        graphTitle="Current Subscription Status"
        showFaq={false}
        backLink={routes.recurringVault}
        product={product}
        subject={Subject.RecurringVault}
        subscribeForm={
          <RecurringPolicy
            type={product?.type.toLocaleLowerCase() === 'call' ? 'call' : 'put'}
            currencySymbol={product?.currency ?? '-'}
          />
        }
        returnOnInvestmentListItems={returnOnInvestmentListItems}
        vaultForm={<VaultForm product={product} />}
        chart={chart}
        chart2={chart2}
      >
        <PrevCycleStats />
      </MgmtPage>
    </>
  )
}

function RecurringPolicy({ type, currencySymbol }: { type: 'call' | 'put'; currencySymbol: string }) {
  const [curIdx, setCurIdx] = useState(0)
  const policy = type === 'call' ? vaultPolicyCall : vaultPolicyPut
  const Text = vaultPolicyText[type]

  const handlePrev = useCallback(() => {
    setCurIdx(preIdx => {
      return preIdx === 0 ? 0 : preIdx - 1
    })
  }, [])

  const handleNext = useCallback(() => {
    setCurIdx(preIdx => {
      return preIdx === policy.length - 1 ? policy.length - 1 : preIdx + 1
    })
  }, [policy.length])

  return (
    <Box display="grid" gap="19px" padding="33px 29px">
      <Typography fontSize={24} fontWeight={700}>
        Recurring Policy
      </Typography>
      <StyledUnorderList>
        <Text currencySymbol={currencySymbol} />
      </StyledUnorderList>
      <Box position="relative">
        <Box width="100%" display="flex" justifyContent="space-between" position="absolute" top="40%">
          <TextButton onClick={handlePrev} disabled={curIdx === 0} style={{ '&:disabled': { opacity: 0 } }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                opacity="0.6"
                d="M11.67 1.77L9.9 0L0 9.9L9.9 19.8L11.67 18.03L3.54 9.9L11.67 1.77Z"
                fill="#31B047"
              />
            </svg>
          </TextButton>
          <TextButton
            onClick={handleNext}
            disabled={curIdx === policy.length - 1}
            style={{ '&:disabled': { opacity: 0 } }}
          >
            <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.6" d="M0 2.12L7.88 10L0 17.88L2.12 20L12.12 10L2.12 0L0 2.12Z" fill="#31B047" />
            </svg>
          </TextButton>
        </Box>
        <Typography fontWeight={700} fontSize={14} color="primary">
          {valutPolicyTitle[curIdx]}
        </Typography>
        {<RecurringPolicyPage img={policy[curIdx].img} text={policy[curIdx].text} />}
      </Box>
      <Box display="flex" gap="5px" margin="10px auto 0">
        {policy.map((item, idx) => {
          const active = curIdx === idx
          return (
            <div
              key={idx}
              style={{
                height: 3,
                width: active ? 24 : 6,
                backgroundColor: active ? '#31B047' : '#C4C4C4',
                transition: '.5s',
                borderRadius: 3
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

function RecurringPolicyPage({ img, text }: { img: ReactElement<any, any>; text: string }) {
  return (
    <Box
      display="flex"
      gap="12px"
      flexDirection="column"
      justifyContent={'space-between'}
      alignItems="center"
      height={200}
    >
      <div />
      <Box height="140px" display="flex" alignItems="center">
        {img}
      </Box>
      <Typography sx={{ color: '#00000060' }} fontWeight={600} fontSize={12} align="center">
        {text}
      </Typography>
    </Box>
  )
}

function PrevCycleStats() {
  const theme = useTheme()
  const data = useMemo(
    () => ({
      ['APY']: '140.25%',
      ['Strike Price']: '62800 USDT',
      ['Executed Price']: '62800 USDT',
      ['Status']: 'Exercised',
      ['Your P&L']: '800 USDT',
      ['Date']: 'From Sep 21, 2021 to Sep 21, 2021'
    }),
    []
  )
  return (
    <Card width={358}>
      <Box display="flex" gap="21px" padding="28px" flexDirection="column" alignItems={'stretch'} height={430}>
        <Typography fontSize={24} fontWeight={700} marginBottom={95}>
          Previous Cycle Statistics
        </Typography>

        {Object.keys(data).map((key, idx) => (
          <Box key={idx} display="flex" justifyContent={'space-between'}>
            <Typography fontSize={16} sx={{ opacity: 0.8 }}>
              {key}
            </Typography>

            <Typography
              color={
                key === 'APY' || (key === 'Status' && data.Status === 'Exercised')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }
            >
              {data[key as keyof typeof data]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
