import { useCallback } from 'react'
import { Typography, useTheme, Box, Container } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Card from 'components/Card/Card'
import NumericalCard from 'components/Card/NumericalCard'
import { NO_REFERRER } from 'constants/index'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import LogoText from 'components/LogoText'
import Button from 'components/Button/Button'
import { useBindModal, useReferalModal } from 'hooks/useReferralModal'
import { useReferral } from 'hooks/useReferral'
import { useActiveWeb3React } from 'hooks'
import NoDataCard from 'components/Card/NoDataCard'
import { trimNumberString } from 'utils/trimNumberString'
import { shortenAddress } from 'utils'
import { SUPPORTED_CURRENCIES } from 'constants/currencies'
import Copy from '../../components/essential/Copy'
import OutlineButton from 'components/Button/OutlineButton'

export default function Referral() {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const { openReferralModal } = useReferalModal()
  const { invitation, inviteCount, balance } = useReferral()
  const { showBindModal } = useBindModal()

  const handleOpenReferral = useCallback(() => {
    openReferralModal(false)
  }, [openReferralModal])

  if (!account)
    return (
      <Container disableGutters sx={{ mt: 48 }}>
        <NoDataCard />
      </Container>
    )
  return (
    <Box mt={48} display="grid" gap={19}>
      <Card padding="38px 24px 60px">
        <Box display={{ xs: 'grid', sm: 'flex' }} justifyContent="space-between" gap={20}>
          <Box display="grid" gap={8}>
            <Typography color={theme.palette.text.primary} fontSize={24} fontWeight={700}>
              My Referral Reward
            </Typography>
            <Typography color={theme.palette.text.secondary} fontSize={16}>
              Recharge to Account to start dual currency wealth management
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {invitation && invitation !== NO_REFERRER ? (
              <>
                <Typography
                  marginRight={6}
                  color={theme.palette.primary.main}
                  fontSize={14}
                  display="flex"
                  alignItems="center"
                  align="right"
                >
                  My referrer: {shortenAddress(invitation)}
                </Typography>
                <Copy toCopy={invitation} />
              </>
            ) : (
              <OutlineButton
                primary
                onClick={showBindModal}
                height="32px"
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  fontSize: 14
                }}
              >
                Bind referral account
              </OutlineButton>
            )}
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={22} mt={34}>
          <NumericalCard
            title="Total Referral Reward Value"
            value={
              balance
                ? trimNumberString(
                    Object.keys(balance)
                      .reduce((acc, key) => {
                        const amount = balance?.[key] && balance?.[key] !== '-' ? +balance[key] : 0
                        return acc + amount
                      }, 0)
                      .toFixed(4)
                  )
                : '-'
            }
            unit="$"
            border
            fontSize="44px"
          />
          <NumericalCard title="Number of Referral Accounts" value={inviteCount ?? '-'} border fontSize="44px">
            <Button
              style={{ width: 148, height: 44, fontSize: 14, transform: 'translateY(50%)' }}
              onClick={handleOpenReferral}
            >
              Referral Link
            </Button>
          </NumericalCard>
          {balance &&
            Object.keys(balance).map((key: string) => {
              if (balance[key] === '-') return
              return (
                <Card padding="16px 22px 28px" gray key={key}>
                  <LogoText logo={<CurrencyLogo currency={SUPPORTED_CURRENCIES[key]} />} text="BTC" />
                  <Typography fontSize={24} fontWeight={700} mt={19}>
                    {balance[key]}
                  </Typography>
                </Card>
              )
            })}
        </Box>
      </Card>
      <Card padding="36px 32px 29px 32px">
        <Box display="flex" gap={8}>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12, width: 12 }} display="inline" />
          <Typography fontSize={12} color={theme.palette.text.secondary} component="span">
            A new user who enters the platform through your referral link can form a binding relationship with you, and
            you will receive a reward of 0.5% of the user’s future investment income
            <br /> You can invite countless new accounts to increase your revenue, but each new user can only have one
            referrer
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
