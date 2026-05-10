import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { Helmet } from 'react-helmet';
import { colors } from '../theme/theme';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Aslisite</title>
        <meta name="description" content="Privacy Policy for Aslisite. Learn how we collect, use, and protect your data." />
      </Helmet>
      
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colors.background.primary }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              backgroundColor: colors.background.paper,
              border: `1px solid ${colors.border.light}`,
              borderRadius: 4,
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
              Privacy Policy
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>
            
            <Divider sx={{ my: 4, borderColor: colors.border.light }} />

            <Box sx={{ '& > p': { mb: 2, color: colors.text.secondary, lineHeight: 1.8 }, '& > h5': { mt: 4, mb: 2, fontWeight: 700 } }}>
              <Typography variant="body1">
                At Aslisite, accessible from aslisite.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Aslisite and how we use it.
              </Typography>
              <Typography variant="body1">
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
              </Typography>

              <Typography variant="h5">Information We Collect</Typography>
              <Typography variant="body1">
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </Typography>
              <Typography variant="body1">
                If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
              </Typography>

              <Typography variant="h5">How We Use Your Information</Typography>
              <Typography variant="body1">
                We use the information we collect in various ways, including to:
              </Typography>
              <ul>
                <li><Typography variant="body1">Provide, operate, and maintain our website</Typography></li>
                <li><Typography variant="body1">Improve, personalize, and expand our website</Typography></li>
                <li><Typography variant="body1">Understand and analyze how you use our website</Typography></li>
                <li><Typography variant="body1">Develop new products, services, features, and functionality</Typography></li>
                <li><Typography variant="body1">Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</Typography></li>
                <li><Typography variant="body1">Send you emails</Typography></li>
                <li><Typography variant="body1">Find and prevent fraud</Typography></li>
              </ul>

              <Typography variant="h5">Log Files</Typography>
              <Typography variant="body1">
                Aslisite follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
              </Typography>

              <Typography variant="h5">Cookies and Web Beacons</Typography>
              <Typography variant="body1">
                Like any other website, Aslisite uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </Typography>

              <Typography variant="h5">Third Party Privacy Policies</Typography>
              <Typography variant="body1">
                Aslisite's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </Typography>
              <Typography variant="body1">
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
              </Typography>

              <Typography variant="h5">Children's Information</Typography>
              <Typography variant="body1">
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
              </Typography>
              <Typography variant="body1">
                Aslisite does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
