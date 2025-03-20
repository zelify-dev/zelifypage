import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      throw new Error('No form data received');
    }

    // Obtener los datos del formulario
    const formData = await request.formData();

    // Crear un nuevo FormData para la solicitud al servicio externo
    const apiFormData = new FormData();
    
    // Transferir todos los campos desde el formulario original
    for (const [key, value] of formData.entries()) {
      // Manejar el archivo CV especialmente
      if (key === 'cv') {
        if (value instanceof File) {
          // Renombrar a 'files' para el API externo
          apiFormData.append('files', value, value.name);
        }
      } else {
        // Transferir los demás campos tal cual
        apiFormData.append(key, value);
      }
    }

    // Si no hay un campo 'to', establecerlo
    if (!formData.has('to')) {
      apiFormData.append('to', 'gmantillam@zwippe.com');
    }
    
    // Si no hay un campo 'subject', establecerlo
    if (!formData.has('subject')) {
      const position = formData.get('position') || 'Not specified';
      const firstName = formData.get('firstName') || '';
      const lastName = formData.get('lastName') || '';
      apiFormData.append('subject', `Solicitud de empleo: ${position} - ${firstName} ${lastName}`);
    }
    
    console.log('Enviando solicitud a servicio externo...');
    
    // Hacer la solicitud al servicio externo
    const apiResponse = await fetch('http://13.218.0.218:3000/zelify/api/generic/mail', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer KIooopooiDiiPoo0'
      },
      body: apiFormData
    });
    
    console.log('Respuesta recibida:', apiResponse.status);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Error from mail service:', errorText);
      throw new Error(`Mail service error: ${apiResponse.status} ${apiResponse.statusText}`);
    }
    
    let responseData;
    try {
      responseData = await apiResponse.json();
    } catch (e) {
      // Si no es JSON, usamos el texto
      const text = await apiResponse.text();
      responseData = { text };
    }
    
    // Devolver la respuesta a la aplicación cliente
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      data: responseData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in mail proxy:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 