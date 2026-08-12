import { Typography } from '@mui/material';
import { colors } from '../../theme/theme';

const SectionBadge = ({ children, sx = {} }) => {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        mb: 2,
        px: 2.5,
        py: 1,
        borderRadius: 2,
        backgroundColor: 'rgba(124, 58, 237, 0.07)',
        color: colors.accent.primary,
        border: `1px solid rgba(124, 58, 237, 0.15)`,
        fontSize: { xs: '0.7rem', sm: '0.75rem' },
        letterSpacing: '0.1em',
        fontWeight: 600,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

export default SectionBadge;
