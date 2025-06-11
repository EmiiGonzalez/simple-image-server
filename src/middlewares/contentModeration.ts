import { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ModeratedRequest extends Request {
  moderationResult?: {
    isSafe: boolean;
    reasons?: string[];
    confidence?: number;
  };
}

export const contentModerationMiddleware = async (
  req: ModeratedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    
    if (!file) {
      next();
      return;
    }

    // Verificar que sea una imagen
    if (!file.mimetype.startsWith('image/')) {
      res.status(400).json({ 
        message: 'Solo se permiten archivos de imagen',
        status: 400 
      });
      return;
    }

    // Configurar el modelo Gemini Pro Vision
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convertir buffer a formato base64
    const imageData = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    // Prompt para detectar contenido sensible
    const prompt = `
    Analiza esta imagen y determina si contiene contenido inapropiado, incluyendo:
    - Contenido pornográfico o sexualmente explícito
    - Desnudez
    - Violencia gráfica
    - Contenido que podría ser ofensivo o inapropiado
    
    Responde en formato JSON con la siguiente estructura:
    {
      "isSafe": boolean,
      "reasons": ["razón1", "razón2"],
      "confidence": number (0-100),
      "description": "breve descripción del contenido"
    }
    
    Si la imagen es segura, marca isSafe como true. Si contiene contenido inapropiado, marca isSafe como false y proporciona las razones específicas.
    `;

    // Generar contenido con Gemini
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    // Parsear la respuesta JSON
    let moderationResult;
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        moderationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se pudo parsear la respuesta de Gemini');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback: analizar la respuesta de texto para palabras clave
      const unsafeKeywords = ['pornographic', 'explicit', 'inappropriate', 'unsafe', 'violence'];
      const isSafe = !unsafeKeywords.some(keyword => 
        text.toLowerCase().includes(keyword)
      );
      
      moderationResult = {
        isSafe,
        reasons: isSafe ? [] : ['Contenido potencialmente inapropiado detectado'],
        confidence: 70,
        description: 'Análisis basado en palabras clave'
      };
    }

    // Si el contenido no es seguro, rechazar la imagen
    if (!moderationResult.isSafe) {
      res.status(400).json({
        message: 'Imagen rechazada: contiene contenido inapropiado',
        reasons: moderationResult.reasons,
        status: 400
      });
      return;
    }

    // Agregar resultado de moderación al request para logs opcionales
    req.moderationResult = moderationResult;

    // Log opcional para monitoreo
    console.log('Imagen aprobada por moderación:', {
      filename: file.originalname,
      confidence: moderationResult.confidence,
      timestamp: new Date().toISOString()
    });

    next();

  } catch (error) {
    console.error('Error en moderación de contenido:', error);
    
    // En caso de error del servicio, puedes decidir si:
    // 1. Rechazar por seguridad (recomendado)
    // 2. Permitir y registrar el error
    
    // Opción 1: Rechazar por seguridad
    res.status(500).json({
      message: 'Error al verificar el contenido de la imagen',
      status: 500
    });
    return;

    // Opción 2: Permitir y continuar (descomenta si prefieres esta opción)
    // console.warn('Continuando sin moderación debido a error del servicio');
    // next();
  }
};

// Middleware opcional para logging de resultados de moderación
export const moderationLogger = (
  req: ModeratedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.moderationResult) {
    // Aquí puedes guardar estadísticas de moderación en tu base de datos
    console.log('Estadísticas de moderación:', {
      isSafe: req.moderationResult.isSafe,
      confidence: req.moderationResult.confidence,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  }
  next();
};