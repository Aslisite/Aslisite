import { Box, Typography } from '@mui/material';
import { colors } from '../../theme/theme';

/**
 * SectionBadge — small pill label used above section headings.
 *
 * Usage A (existing pattern — children as text):
 *   <SectionBadge>Our Services</SectionBadge>
 *
 * Usage B (tool pages — icon + label props):
 *   <SectionBadge icon={Calculator} label="GST 2.0 Updated" />
 */
const SectionBadge = ({ children, icon: Icon, label, sx = {} }) => {
  const content = label ?? children;

  return (
    <Typography
      variant="overline"
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
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
      {Icon && (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          <Icon size={12} strokeWidth={2.5} />
        </Box>
      )}
      {content}
    </Typography>
  );
};

export default SectionBadge;
