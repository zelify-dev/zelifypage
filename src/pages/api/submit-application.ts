import type { APIRoute } from 'astro';
// import nodemailer from 'nodemailer';

export const post: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      throw new Error('No form data received');
    }

    const formData = await request.formData();
    const cvFile = formData.get('cv') as File;
    
    if (!cvFile || !(cvFile instanceof File)) {
      throw new Error('CV file is required');
    }

    // Convert FormData to object
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== 'cv') {
        data[key] = value.toString();
      }
    });

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Log application data (for static build)
    console.log('Application received:', {
      ...data,
      cvFileName: cvFile.name,
      cvFileSize: cvFile.size
    });

    /* 
    // Email functionality disabled for static build
    // Validate environment variables
    const emailUser = import.meta.env.EMAIL_USER;
    const emailPass = import.meta.env.EMAIL_PASSWORD;
    const emailHost = import.meta.env.EMAIL_HOST || 'smtp.dreamhost.com';
    const emailPort = parseInt(import.meta.env.EMAIL_PORT || '465');

    if (!emailUser || !emailPass) {
      throw new Error('Email configuration is missing');
    }

    // Create email transporter with Dreamhost configuration
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: true, // Use SSL/TLS
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      throw new Error('Failed to connect to email server');
    }

    // Convert CV file to buffer for attachment
    const arrayBuffer = await cvFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Format application data for email body
    const formatApplicationData = (data: Record<string, string>) => {
      const sections = {
        'Personal Information': ['firstName', 'lastName', 'email', 'phone'],
        'Technical Assessment': [
          'experience', 'team_size', 'neobanking', 'nestjs', 'kafka',
          'api_integration', 'docker', 'aws_ecs', 'availability'
        ]
      };

      let emailBody = '';
      
      for (const [section, fields] of Object.entries(sections)) {
        emailBody += `\n${section}:\n`;
        emailBody += ''.padStart(section.length + 1, '=') + '\n\n';
        
        for (const field of fields) {
          if (data[field]) {
            const fieldName = field
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            emailBody += `${fieldName}: ${data[field]}\n`;
          }
        }
        emailBody += '\n';
      }

      return emailBody;
    };

    // Send email
    try {
      await transporter.sendMail({
        from: `"Zelify Jobs" <${emailUser}>`,
        to: 'info@alejandrollanganate.com',
        subject: `New Job Application: ${data.firstName} ${data.lastName}`,
        text: formatApplicationData(data),
        attachments: [
          {
            filename: cvFile.name,
            content: buffer
          }
        ]
      });
      console.log('Email sent successfully');
    } catch (sendError) {
      console.error('Failed to send email:', sendError);
      throw new Error('Failed to send application email');
    }
    */

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Application submitted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to process application',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 