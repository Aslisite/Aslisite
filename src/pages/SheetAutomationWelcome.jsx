import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';
import { absoluteUrl } from '../seo/siteMetadata';
import { Video, ClipboardList, CheckCircle2, PlayCircle, ExternalLink } from 'lucide-react';

const SheetAutomationWelcome = () => {
  const [steps, setSteps] = useState({
    folder1: false,
    folder2: false,
    copyTemplate: false,
    pasteKey: false,
    testTrigger: false,
  });

  const handleStepChange = (step) => {
    setSteps({ ...steps, [step]: !steps[step] });
  };

  const completedCount = Object.values(steps).filter(Boolean).length;
  const totalCount = Object.keys(steps).length;

  return (
    <>
      <Helmet>
        <title>Sheet Automation: Setup Onboarding Welcome</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={absoluteUrl('/products/sheet-automation/welcome')} />
      </Helmet>

      <Box
        sx={{
          backgroundColor: colors.background.primary,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        {/* Neon blur grids */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            right: '10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 65%)',
            filter: 'blur(45px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '8%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 65%)',
            filter: 'blur(55px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Header Block */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0.35, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle2
                size={54}
                color={colors.accent.secondary}
                style={{ marginBottom: 16 }}
              />
            </motion.div>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                color: '#fff',
                mb: 2,
              }}
            >
              Welcome to Sheet Automation
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: colors.text.secondary, maxWidth: '600px', mx: 'auto' }}
            >
              Your order is verified. Follow these steps to initialize your self-hosted invoice
              chaser in under 5 minutes.
            </Typography>
          </Box>

          <Stack spacing={4}>
            {/* Step 1 Action Card */}
            <Card
              component={motion.div}
              initial={{ opacity: 0.35, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={{
                borderLeft: `5px solid ${colors.accent.primary}`,
                backgroundColor: 'rgba(19, 24, 36, 0.7)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack
                  spacing={2}
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 700,
                        color: '#fff',
                        mb: 1,
                      }}
                    >
                      1. Copy the Spreadsheet Template
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Create your own personal self-hosted copy of the Sheet Automation master
                      dashboard in Google Sheets.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    href="https://docs.google.com/spreadsheets/d/1JkLIo-TJQwOWhEldERmNWnj-R8yOFxgXZmdW5lfUoKc/copy"
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<ExternalLink size={16} />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      flexShrink: 0,
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.25)',
                    }}
                  >
                    Clone Master Sheet Template
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Video Walkthrough Container Card */}
            <Card
              component={motion.div}
              initial={{ opacity: 0.35, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                backgroundColor: 'rgba(19, 24, 36, 0.7)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 700,
                    color: '#fff',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Video size={22} color={colors.accent.secondary} />
                  Setup Walkthrough Guide
                </Typography>

                {/* Loom Video Mockup Frame */}
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: 2,
                    background:
                      'radial-gradient(circle, rgba(13, 17, 28, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
                    border: `1px solid ${colors.border.light}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease',
                    '&:hover': {
                      borderColor: colors.accent.primary,
                    },
                  }}
                >
                  <PlayCircle
                    size={64}
                    color={colors.accent.primary}
                    style={{ opacity: 0.85, zIndex: 3 }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ color: colors.text.primary, mt: 2, fontWeight: 600, zIndex: 3 }}
                  >
                    Watch Loom Setup Walkthrough
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.muted, zIndex: 3 }}>
                    3 minutes step-by-step setup overview
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(168, 85, 247, 0.03)',
                      zIndex: 1,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Checklist Card */}
            <Card
              component={motion.div}
              initial={{ opacity: 0.35, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{
                backgroundColor: 'rgba(19, 24, 36, 0.7)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 700,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <ClipboardList size={22} color={colors.accent.secondary} />
                    Deployment Documentation Checklist
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.accent.secondary, fontWeight: 700 }}
                  >
                    {completedCount}/{totalCount} Completed
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 3, borderColor: colors.border.light }} />

                <FormGroup sx={{ gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${steps.folder1 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)'}`,
                      backgroundColor: steps.folder1 ? 'rgba(6, 182, 212, 0.02)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Checkbox
                      checked={steps.folder1}
                      onChange={() => handleStepChange('folder1')}
                      sx={{
                        color: colors.border.medium,
                        '&.Mui-checked': { color: colors.accent.secondary },
                        pt: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 650 }}>
                        {"Create Google Drive 'Invoices to Send' Folder"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Initialize a folder in your Google Drive named `Invoices to Send` where your
                        PDFs will be dropped for chaser auto-detection.
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${steps.folder2 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)'}`,
                      backgroundColor: steps.folder2 ? 'rgba(6, 182, 212, 0.02)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Checkbox
                      checked={steps.folder2}
                      onChange={() => handleStepChange('folder2')}
                      sx={{
                        color: colors.border.medium,
                        '&.Mui-checked': { color: colors.accent.secondary },
                        pt: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 650 }}>
                        {"Create 'Sent Invoices' Folder"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Initialize a separate folder named `Sent Invoices`. This is where PDFs are
                        moved after they have been processed and dispatched.
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${steps.copyTemplate ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)'}`,
                      backgroundColor: steps.copyTemplate
                        ? 'rgba(6, 182, 212, 0.02)'
                        : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Checkbox
                      checked={steps.copyTemplate}
                      onChange={() => handleStepChange('copyTemplate')}
                      sx={{
                        color: colors.border.medium,
                        '&.Mui-checked': { color: colors.accent.secondary },
                        pt: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 650 }}>
                        Configure Spreadsheet Settings
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        Paste the folder IDs of both created Drive folders into the configuration
                        block of your new Spreadsheet template.
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${steps.pasteKey ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)'}`,
                      backgroundColor: steps.pasteKey ? 'rgba(6, 182, 212, 0.02)' : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Checkbox
                      checked={steps.pasteKey}
                      onChange={() => handleStepChange('pasteKey')}
                      sx={{
                        color: colors.border.medium,
                        '&.Mui-checked': { color: colors.accent.secondary },
                        pt: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 650 }}>
                        Activate Apps Script Triggers
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {
                          "Open the built-in Extension > Apps Script editor. Click 'Triggers' in the side bar and configure `processInvoices` to run daily."
                        }
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${steps.testTrigger ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)'}`,
                      backgroundColor: steps.testTrigger
                        ? 'rgba(6, 182, 212, 0.02)'
                        : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Checkbox
                      checked={steps.testTrigger}
                      onChange={() => handleStepChange('testTrigger')}
                      sx={{
                        color: colors.border.medium,
                        '&.Mui-checked': { color: colors.accent.secondary },
                        pt: 0,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 650 }}>
                        Run Initial Manual Sync Test
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {
                          "Click the 'Run' button inside Apps Script to trigger the script once. Give OAuth approval so it runs autonomously in your Google Workspace."
                        }
                      </Typography>
                    </Box>
                  </Box>
                </FormGroup>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default SheetAutomationWelcome;
