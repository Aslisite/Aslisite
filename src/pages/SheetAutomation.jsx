import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIconImport from '@mui/icons-material/ExpandMore';
import { Helmet } from 'react-helmet-async';

const ExpandMoreIcon = ExpandMoreIconImport.default || ExpandMoreIconImport;
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';
import { absoluteUrl } from '../seo/siteMetadata';
import {
  Clipboard,
  Check,
  Video,
  FileSpreadsheet,
  PlayCircle,
  ExternalLink,
  BookOpen,
  Settings,
  Zap,
} from 'lucide-react';

const scriptCode = `// CHANGE THIS TO YOUR BOUND SPREADSHEET ID IF NEEDED, OR LEAVE AS IS IF RUNNING CONTAINER-BOUND
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// 1. PHASE 1: DISPATCH INITIAL INVOICES FROM DRIVE
function sendInitialInvoices() {
  const sourceFolder = DriveApp.getFoldersByName("Invoices to Send").next();
  const targetFolder = DriveApp.getFoldersByName("Sent Invoices").next();
  const files = sourceFolder.getFiles();

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const customerSheet = ss.getSheetByName("Client_Emails");
  const trackingSheet = ss.getSheetByName("Invoice_Tracking");

  const customerData = customerSheet.getDataRange().getValues();

  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();

    // Split filename by underscore. Example: "INV-1001_Acme Corp.xlsx"
    const parts = fileName.split("_");
    if (parts.length < 2) continue;

    const invoiceNumber = parts[0].trim();
    
    // Dynamically isolate and strip out any file extension extension (e.g. .pdf, .xlsx, .docx)
    const rawCustomerPart = parts[1];
    const customer = rawCustomerPart.substring(0, rawCustomerPart.lastIndexOf('.')).trim();

    let toEmails = "";
    let ccEmails = "";

    // Lookup customer emails from Client_Emails directory
    for (let i = 1; i < customerData.length; i++) {
      if (customerData[i][0].trim().toLowerCase() === customer.toLowerCase()) {
        toEmails = customerData[i][1];
        ccEmails = customerData[i][2];
        break;
      }
    }

    if (toEmails) {
      const subject = "Tax Invoice Issued - " + invoiceNumber;

      const body =
        "Dear Customer,\\n\\n" +
        "Please find attached your digital invoice " + invoiceNumber + " for services/goods rendered.\\n\\n" +
        "We kindly request that you review the statement and arrange for payment according to the agreed credit terms.\\n\\n" +
        "Thank you for your business!\\n\\n" +
        "Best regards,\\nAccounts Receivable Team";

      // Dispatch via Gmail API
      GmailApp.sendEmail(toEmails, subject, body, {
        attachments: [file.getBlob()],
        cc: ccEmails
      });

      // Append row initialization into the Invoice_Tracking database log
      trackingSheet.appendRow([
        invoiceNumber,
        customer,
        new Date(), // Current timestamp as Date Sent
        "Pending",
        0,          // Days Pending starts at 0
        0           // Reminder Level starts at 0 (Initial sent)
      ]);

      // Archive file into the storage destination folder
      file.moveTo(targetFolder);
    }
  }
}

// 2. MAINTENANCE PHASE: DYNAMIC ENGINE DAY UPDATES
function updateInvoicePendingDays() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Invoice_Tracking");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const dateSent = new Date(data[i][2]);
    const status = data[i][3];

    // Only track time dimensions if payment has not landed yet
    if (status === "Pending") {
      const differenceInMs = new Date() - dateSent;
      const daysPending = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
      
      // Write the updated days metric back to Column 5 (Column E)
      sheet.getRange(i + 1, 5).setValue(daysPending);
    }
  }
}

// 3. LIFECYCLE PHASE: AUTOMATED ESCALATION CHASER REMINDERS
function processInvoiceReminders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const trackingSheet = ss.getSheetByName("Invoice_Tracking");
  const customerSheet = ss.getSheetByName("Client_Emails");

  const trackingData = trackingSheet.getDataRange().getValues();
  const customerData = customerSheet.getDataRange().getValues();

  for (let i = 1; i < trackingData.length; i++) {
    const invoiceNumber = trackingData[i][0];
    const customer      = trackingData[i][1];
    const dateSent      = new Date(trackingData[i][2]);
    const status        = trackingData[i][3];
    const currentLevel  = trackingData[i][5]; // Column F

    // Safeguard: Stop tracking execution immediately if invoice status is paid
    if (status !== "Pending") continue;

    const daysPending = Math.floor((new Date() - dateSent) / (1000 * 60 * 60 * 24));

    let toEmails = "";
    let ccEmails = "";

    // Lookup contact matrix info
    for (let j = 1; j < customerData.length; j++) {
      if (customerData[j][0].trim().toLowerCase() === customer.toLowerCase()) {
        toEmails = customerData[j][1];
        ccEmails = customerData[j][2];
        break;
      }
    }

    if (!toEmails) continue;

    let subject = "";
    let body = "";
    let systemNextLevel = currentLevel;

    // STAGE 1: GENTLE REMINDER (3 Days after initial drop)
    if (daysPending >= 3 && currentLevel == 0) {
      subject = "Friendly Reminder: Invoice Payment Due Notice - " + invoiceNumber;
      body =
        "Dear Customer,\\n\\n" +
        "This is a gentle notification regarding outstanding Invoice #" + invoiceNumber + " sent to you a few days ago.\\n\\n" +
        "Kindly verify with your accounting department if this item has been scheduled for settlement.\\n\\n" +
        "Warm regards,\\nFinance Division";

      systemNextLevel = 1;
    }

    // STAGE 2: FORMAL OVERDUE REMINDER (7 Days after initial drop)
    else if (daysPending >= 7 && currentLevel == 1) {
      subject = "Second Notice: Overdue Balance Invoice #" + invoiceNumber;
      body =
        "Dear Customer,\\n\\n" +
        "We are writing to remind you that your payment for invoice #" + invoiceNumber + " is currently overdue.\\n\\n" +
        "Please look into this account status immediately and confirm back with remittance proof.\\n\\n" +
        "Regards,\\nAccounts Team";

      systemNextLevel = 2;
    }

    // STAGE 3: FINAL COLLECTION ESCALATION (14 Days after initial drop)
    else if (daysPending >= 14 && currentLevel == 2) {
      subject = "FINAL REMINDER: Urgent Settlement Account Action Required - " + invoiceNumber;
      body =
        "Dear Customer,\\n\\n" +
        "Despite previous reminders, your account balance for invoice #" + invoiceNumber + " remains unpaid.\\n\\n" +
        "Please take note that if payment details are not reconciled within 48 hours, late service processing measures may apply.\\n\\n" +
        "We request your immediate intervention.\\n\\n" +
        "Respectfully,\\nFinance Management Office";

      systemNextLevel = 3;
    }

    // If an action matches a target time boundary, distribute the email alert
    if (subject) {
      GmailApp.sendEmail(toEmails, subject, body, { cc: ccEmails });
      
      // Update Column 6 (Column F) tracking marker level value
      trackingSheet.getRange(i + 1, 6).setValue(systemNextLevel);
    }
  }
}`;

const highlightCode = (code) => {
  let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Highlight keywords
  const keywords =
    /\b(const|let|var|function|return|if|else|for|while|new|typeof|try|catch|finally|true|false|null|undefined)\b/g;
  escaped = escaped.replace(keywords, '<span style="color: #569cd6; font-weight: bold;">$1</span>');

  // Highlight string literals (double, single quotes and backticks)
  const strings = /(["'`])([\s\S]*?)\1/g;
  escaped = escaped.replace(strings, '<span style="color: #ce9178;">$1$2$1</span>');

  // Highlight comments
  const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  escaped = escaped.replace(
    comments,
    '<span style="color: #6a9955; font-style: italic;">$1</span>',
  );

  // Highlight built-in Google Apps Script classes and standard JS globals
  const builtins = /\b(SpreadsheetApp|Logger|MailApp|Utilities|Session|Date|Math|typeof)\b/g;
  escaped = escaped.replace(builtins, '<span style="color: #4ec9b0; font-weight: bold;">$1</span>');

  return escaped;
};

const SheetAutomation = () => {
  const [copied, setCopied] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageTitle = 'Free Payment Reminder Apps Script & Google Sheet Template';
  const pageDescription =
    'Copy the free Google Apps Script code and clone the master Google Sheets template to build your own automated self-hosted invoice chaser.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={absoluteUrl('/products/sheet-automation')} />
        <meta property="og:url" content={absoluteUrl('/products/sheet-automation')} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/AslisiteLogo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Main Container */}
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
        {/* Glow Effects */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '8%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* HEADER HERO */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <motion.div
              initial={{ opacity: 0.35, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                component="span"
                sx={{
                  display: 'inline-block',
                  mb: 2,
                  px: 2.5,
                  py: 0.75,
                  borderRadius: '9999px',
                  border: `1px solid ${colors.border.accent}`,
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  color: colors.accent.primary,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Free YouTube Tutorial Resource
              </Typography>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0.35, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: '"Space Grotesk", "Inter", sans-serif',
                fontWeight: 800,
                fontSize: '2.5rem',
                lineHeight: 1.15,
                margin: '16px auto',
                maxWidth: '900px',
              }}
            >
              <span style={{ color: '#fff' }}>Google Sheets </span>
              <span
                style={{
                  background: colors.accent.gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Payment Reminder Automation Script
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0.35, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: colors.text.secondary,
                fontSize: '1.1rem',
                lineHeight: 1.7,
                maxWidth: '750px',
                margin: '0 auto 36px auto',
                fontWeight: 450,
              }}
            >
              Never chase unpaid invoices manually again. Follow our YouTube tutorial, copy the free
              Google Apps Script code below, clone our pre-built Google Sheet template, and deploy
              your custom automatic email chaser in minutes.
            </motion.p>
          </Box>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {/* TOP ROW: Template Link & Setup Video */}
            <Grid item xs={12} md={6}>
              {/* Clone Sheet Card */}
              <Card
                component={motion.div}
                initial={{ opacity: 0.35, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{
                  backgroundColor: 'rgba(19, 24, 36, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${colors.border.accent}`,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(168, 85, 247, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          backgroundColor: 'rgba(168, 85, 247, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.accent.primary,
                        }}
                      >
                        <FileSpreadsheet size={24} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontFamily: '"Space Grotesk", sans-serif',
                          }}
                        >
                          Google Sheet Template
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.text.muted }}>
                          Pre-formatted invoice tracking sheet
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, lineHeight: 1.6 }}
                    >
                      {
                        "We pre-built a dashboard structure with correctly labeled sheets ('Client_Emails' and 'Invoice_Tracking') and column systems so the automated script works instantly."
                      }
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    href="https://docs.google.com/spreadsheets/d/1hfMYbvNN2fu5fCYmCJIAjPnIY5QHDzrplEbV6Bs-fes/copy"
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<ExternalLink size={16} />}
                    sx={{
                      mt: 3,
                      py: 1.6,
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderRadius: 2.5,
                      background: colors.accent.gradient,
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.25)',
                      '&:hover': {
                        background: colors.accent.gradient,
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Clone Master Sheet Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Video Card */}
              <Card
                component={motion.div}
                initial={{ opacity: 0.35, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                sx={{
                  backgroundColor: 'rgba(19, 24, 36, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", sans-serif',
                        mb: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Video size={20} color={colors.accent.secondary} />
                      Setup Video Walkthrough
                    </Typography>

                    {!playVideo ? (
                      <Box
                        onClick={() => setPlayVideo(true)}
                        sx={{
                          width: '100%',
                          aspectRatio: '16/9',
                          borderRadius: 2,
                          backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.5), rgba(2, 6, 23, 0.75)), url(https://img.youtube.com/vi/jNQRqG67rq0/maxresdefault.jpg)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: `1px solid ${colors.border.light}`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: colors.accent.secondary,
                            transform: 'scale(1.005)',
                            '& .play-btn': {
                              transform: 'scale(1.1)',
                              color: colors.accent.secondary,
                            },
                          },
                        }}
                      >
                        <PlayCircle
                          className="play-btn"
                          size={54}
                          color="#fff"
                          style={{ transition: 'all 0.3s ease', opacity: 0.9 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: '#fff', mt: 1.5, fontWeight: 600 }}
                        >
                          Watch YouTube Tutorial
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        component="iframe"
                        src="https://youtu.be/rM0u-fF5loQ?si=i8FMXr4KG8Q2lW4K"
                        title="Apps Script Payment Reminder Setup Guide"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sx={{
                          width: '100%',
                          aspectRatio: '16/9',
                          borderRadius: 2,
                          border: `1px solid ${colors.border.light}`,
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* BOTTOM ROW: Code Editor window in Full Width */}
            <Grid item xs={12}>
              <Card
                component={motion.div}
                initial={{ opacity: 0.35, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                sx={{
                  backgroundColor: '#111827',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                }}
              >
                {/* Editor Header Bar */}
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    backgroundColor: '#1f2937',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#ff5f56',
                      }}
                    />
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#ffbd2e',
                      }}
                    />
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#27c93f',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        fontFamily: 'monospace',
                        ml: 2,
                        fontSize: '0.85rem',
                        letterSpacing: 0.5,
                      }}
                    >
                      PaymentReminder.gs
                    </Typography>
                  </Stack>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCopy}
                    startIcon={copied ? <Check size={14} /> : <Clipboard size={14} />}
                    sx={{
                      color: copied ? '#27c93f' : colors.text.primary,
                      borderColor: copied ? '#27c93f' : 'rgba(255,255,255,0.15)',
                      px: 2,
                      py: 0.75,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      backgroundColor: copied ? 'rgba(39, 201, 63, 0.05)' : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: copied ? '#27c93f' : colors.accent.primary,
                        backgroundColor: copied
                          ? 'rgba(39, 201, 63, 0.08)'
                          : 'rgba(255,255,255,0.02)',
                      },
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </Box>

                {/* Editor Code Body */}
                <Box
                  sx={{
                    p: 3,
                    maxHeight: '600px',
                    overflowY: 'auto',
                    backgroundColor: '#030712',
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: '"Fira Code", Consolas, Monaco, "Andale Mono", monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: '#d4d4d4',
                      whiteSpace: 'pre',
                      wordBreak: 'normal',
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightCode(scriptCode) }}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* INSTALLATION STEP-BY-STEP */}
          <Box sx={{ maxWidth: '900px', mx: 'auto', mb: { xs: 4, md: 8 } }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 750,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                mb: 6,
                color: '#fff',
              }}
            >
              How to Deploy the Script
            </Typography>

            <Stack spacing={2.5}>
              <Accordion
                defaultExpanded
                sx={{
                  backgroundColor: 'rgba(19, 24, 36, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                  sx={{ py: 1 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.primary,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      1
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <BookOpen size={18} color={colors.accent.primary} />
                      {'Way 1: Using Cloned Google Sheet Template (Easiest)'}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: 4, pb: 3, borderTop: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: colors.text.secondary, lineHeight: 1.7 }}
                  >
                    1. Click the <strong>Clone Master Sheet Template</strong> button above to copy
                    the pre-formatted sheet directly into your Google Drive.
                    <br />
                    <br />
                    2. Open your Google Drive, go to your root directory, and create two new folders
                    named exactly: <code>Invoices to Send</code> and <code>Sent Invoices</code>.
                    <br />
                    <br />
                    3. Open the cloned Google Sheet, navigate to <strong>Extensions</strong> in the
                    top toolbar, and select <strong>Apps Script</strong>.
                    <br />
                    <br />
                    4. In the Apps Script code editor, select <code>sendInitialInvoices</code> from
                    the dropdown menu at the top and click <strong>Run</strong>.
                    <br />
                    <br />
                    5. Follow the prompts to authorize permissions (select account, click{' '}
                    <strong>Advanced</strong>, and click{' '}
                    <strong>Go to Untitled Project (unsafe)</strong>, then click{' '}
                    <strong>Allow</strong>).
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{
                  backgroundColor: 'rgba(19, 24, 36, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                  sx={{ py: 1 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.secondary,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      2
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Settings size={18} color={colors.accent.secondary} />
                      {'Way 2: Setting Up From a Fresh Google Sheet'}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: 4, pb: 3, borderTop: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: colors.text.secondary, lineHeight: 1.7 }}
                  >
                    1. Create a brand new Google Sheet. Rename the first sheet tab to{' '}
                    <code>Client_Emails</code> and create a second tab named{' '}
                    <code>Invoice_Tracking</code>.
                    <br />
                    <br />
                    2. In the <code>Client_Emails</code> tab, create headers in Row 1: Column A ={' '}
                    <strong>Client Name</strong>, Column B = <strong>Client Email</strong>, and
                    Column C = <strong>CC Email</strong>.
                    <br />
                    <br />
                    3. In the <code>Invoice_Tracking</code> tab, create headers in Row 1: Column A ={' '}
                    <strong>Invoice Number</strong>, Column B = <strong>Client Name</strong>, Column
                    C = <strong>Date Sent</strong>, Column D = <strong>Status</strong>, Column E ={' '}
                    <strong>Days Pending</strong>, and Column F = <strong>Reminder Level</strong>.
                    <br />
                    <br />
                    4. Open your Google Drive root folder and create two new folders named:{' '}
                    <code>Invoices to Send</code> and <code>Sent Invoices</code>.
                    <br />
                    <br />
                    5. Open your sheet, click <strong>Extensions</strong> &gt;{' '}
                    <strong>Apps Script</strong>. Delete any starter template code, paste the code
                    copied from this page, and click the Save icon (<strong>Ctrl + S</strong>).
                    <br />
                    <br />
                    6. Select <code>sendInitialInvoices</code> from the dropdown, click{' '}
                    <strong>Run</strong>, and complete the authorization dialog permissions.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{
                  backgroundColor: 'rgba(19, 24, 36, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                  sx={{ py: 1 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.accent.primary,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      3
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Zap size={18} color={colors.accent.primary} />
                      Set Up Automated Time-Driven Triggers
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: 4, pb: 3, borderTop: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: colors.text.secondary, lineHeight: 1.7 }}
                  >
                    To automate the whole workflow, click on the **alarm clock icon (Triggers)** on
                    the left sidebar of the Apps Script dashboard. Add the following three triggers:
                    <br />
                    <br />
                    <strong>1. Dispatching New Invoices:</strong>
                    <br />- Function to run: <code>sendInitialInvoices</code>
                    <br />- Event source: <strong>Time-driven</strong>
                    <br />- Trigger type: <strong>Hour timer / Every hour</strong> (checks for new
                    files in your Drive folder and emails them automatically).
                    <br />
                    <br />
                    <strong>2. Updating Days Elapsed:</strong>
                    <br />- Function to run: <code>updateInvoicePendingDays</code>
                    <br />- Event source: <strong>Time-driven</strong>
                    <br />- Trigger type: <strong>Day timer / Midnight to 1am</strong> (increments
                    the days counter in the tracking sheet every night).
                    <br />
                    <br />
                    <strong>3. Sending Escalation Reminders:</strong>
                    <br />- Function to run: <code>processInvoiceReminders</code>
                    <br />- Event source: <strong>Time-driven</strong>
                    <br />- Trigger type: <strong>Day timer / 9am to 10am</strong> (checks overdue
                    invoices daily and automatically dispatches escalation reminder emails).
                    <br />
                    <br />
                    Click **Save** on each trigger, and your reminder system is fully automated on
                    autopilot!
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SheetAutomation;
