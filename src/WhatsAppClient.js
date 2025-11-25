const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Cliente para WhatsApp Cloud API
 */
class WhatsAppClient {
  /**
   * @param {Object} config - Configuração do cliente
   * @param {string} config.phoneNumberId - ID do número de telefone do WhatsApp Business
   * @param {string} config.accessToken - Token de acesso da API
   * @param {string} [config.apiVersion='v18.0'] - Versão da API
   */
  constructor(config) {
    if (!config.phoneNumberId) {
      throw new Error('phoneNumberId é obrigatório');
    }
    if (!config.accessToken) {
      throw new Error('accessToken é obrigatório');
    }

    this.phoneNumberId = config.phoneNumberId;
    this.accessToken = config.accessToken;
    this.apiVersion = config.apiVersion || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
  }

  /**
   * Faz uma requisição para a API
   * @private
   */
  async _makeRequest(endpoint, data, headers = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...headers
          }
        }
      );
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Trata erros da API
   * @private
   */
  _handleError(error) {
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage = errorData.error?.message || 'Erro desconhecido';
      const errorCode = errorData.error?.code || 'UNKNOWN';
      
      const customError = new Error(`WhatsApp API Error [${errorCode}]: ${errorMessage}`);
      customError.code = errorCode;
      customError.details = errorData;
      return customError;
    }
    return error;
  }

  /**
   * Valida o número de telefone
   * @private
   */
  _validatePhoneNumber(phoneNumber) {
    // Remove caracteres não numéricos
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
      throw new Error('Número de telefone inválido. Use o formato internacional (ex: 5511999999999)');
    }
    
    return cleanNumber;
  }

  /**
   * Faz upload de mídia para a API
   * @private
   */
  async _uploadMedia(filePath, mimeType) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('messaging_product', 'whatsapp');
      formData.append('type', mimeType);

      const response = await axios.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/media`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            ...formData.getHeaders()
          }
        }
      );

      return response.data.id;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Obtém o tipo MIME baseado na extensão do arquivo
   * @private
   */
  _getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      // Imagens
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      
      // Vídeos
      '.mp4': 'video/mp4',
      '.3gp': 'video/3gp',
      
      // Documentos
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Verifica o tamanho do arquivo (máximo 16MB)
   * @private
   */
  _validateFileSize(filePath) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    
    if (fileSizeInMB > 16) {
      throw new Error(`Arquivo muito grande (${fileSizeInMB.toFixed(2)}MB). O tamanho máximo é 16MB.`);
    }
  }

  /**
   * Envia uma mensagem de texto
   * @param {Object} options - Opções da mensagem
   * @param {string} options.to - Número do destinatário (formato internacional)
   * @param {string} options.text - Texto da mensagem
   * @returns {Promise<Object>} Resposta da API
   */
  async sendText(options) {
    const { to, text } = options;

    if (!to || !text) {
      throw new Error('Os parâmetros "to" e "text" são obrigatórios');
    }

    const phoneNumber = this._validatePhoneNumber(to);

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: text
      }
    };

    return await this._makeRequest('/messages', data);
  }

  /**
   * Envia uma imagem
   * @param {Object} options - Opções da mensagem
   * @param {string} options.to - Número do destinatário
   * @param {string} [options.imageUrl] - URL da imagem
   * @param {string} [options.imagePath] - Caminho local da imagem
   * @param {string} [options.caption] - Legenda da imagem
   * @returns {Promise<Object>} Resposta da API
   */
  async sendImage(options) {
    const { to, imageUrl, imagePath, caption } = options;

    if (!to) {
      throw new Error('O parâmetro "to" é obrigatório');
    }

    if (!imageUrl && !imagePath) {
      throw new Error('É necessário fornecer "imageUrl" ou "imagePath"');
    }

    const phoneNumber = this._validatePhoneNumber(to);

    let imageData = {};

    if (imagePath) {
      // Valida o tamanho do arquivo
      this._validateFileSize(imagePath);
      
      // Faz upload da imagem
      const mimeType = this._getMimeType(imagePath);
      const mediaId = await this._uploadMedia(imagePath, mimeType);
      imageData = { id: mediaId };
    } else {
      imageData = { link: imageUrl };
    }

    if (caption) {
      imageData.caption = caption;
    }

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'image',
      image: imageData
    };

    return await this._makeRequest('/messages', data);
  }

  /**
   * Envia um vídeo
   * @param {Object} options - Opções da mensagem
   * @param {string} options.to - Número do destinatário
   * @param {string} [options.videoUrl] - URL do vídeo
   * @param {string} [options.videoPath] - Caminho local do vídeo
   * @param {string} [options.caption] - Legenda do vídeo
   * @returns {Promise<Object>} Resposta da API
   */
  async sendVideo(options) {
    const { to, videoUrl, videoPath, caption } = options;

    if (!to) {
      throw new Error('O parâmetro "to" é obrigatório');
    }

    if (!videoUrl && !videoPath) {
      throw new Error('É necessário fornecer "videoUrl" ou "videoPath"');
    }

    const phoneNumber = this._validatePhoneNumber(to);

    let videoData = {};

    if (videoPath) {
      // Valida o tamanho do arquivo
      this._validateFileSize(videoPath);
      
      // Faz upload do vídeo
      const mimeType = this._getMimeType(videoPath);
      const mediaId = await this._uploadMedia(videoPath, mimeType);
      videoData = { id: mediaId };
    } else {
      videoData = { link: videoUrl };
    }

    if (caption) {
      videoData.caption = caption;
    }

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'video',
      video: videoData
    };

    return await this._makeRequest('/messages', data);
  }

  /**
   * Envia um documento
   * @param {Object} options - Opções da mensagem
   * @param {string} options.to - Número do destinatário
   * @param {string} [options.documentUrl] - URL do documento
   * @param {string} [options.documentPath] - Caminho local do documento
   * @param {string} [options.caption] - Legenda do documento
   * @param {string} [options.filename] - Nome do arquivo
   * @returns {Promise<Object>} Resposta da API
   */
  async sendDocument(options) {
    const { to, documentUrl, documentPath, caption, filename } = options;

    if (!to) {
      throw new Error('O parâmetro "to" é obrigatório');
    }

    if (!documentUrl && !documentPath) {
      throw new Error('É necessário fornecer "documentUrl" ou "documentPath"');
    }

    const phoneNumber = this._validatePhoneNumber(to);

    let documentData = {};

    if (documentPath) {
      // Valida o tamanho do arquivo
      this._validateFileSize(documentPath);
      
      // Faz upload do documento
      const mimeType = this._getMimeType(documentPath);
      const mediaId = await this._uploadMedia(documentPath, mimeType);
      documentData = { id: mediaId };
    } else {
      documentData = { link: documentUrl };
    }

    if (caption) {
      documentData.caption = caption;
    }

    if (filename) {
      documentData.filename = filename;
    }

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'document',
      document: documentData
    };

    return await this._makeRequest('/messages', data);
  }

  /**
   * Envia botões interativos (Reply Buttons)
   * @param {Object} options - Opções da mensagem
   * @param {string} options.to - Número do destinatário
   * @param {string} options.body - Texto principal da mensagem (máx 1024 caracteres)
   * @param {Array<Object>} options.buttons - Array de botões (máximo 3)
   * @param {string} options.buttons[].id - ID único do botão (máx 256 caracteres, obrigatório ser único)
   * @param {string} options.buttons[].title - Título do botão (máx 20 caracteres)
   * @param {string} [options.header] - Texto do cabeçalho (máx 60 caracteres)
   * @param {string} [options.footer] - Texto do rodapé (máx 60 caracteres)
   * @returns {Promise<Object>} Resposta da API
   */
  async sendButtons(options) {
    const { to, body, buttons, header, footer } = options;

    if (!to) {
      throw new Error('O parâmetro "to" é obrigatório');
    }
    if (!body || body.trim().length === 0) {
      throw new Error('O parâmetro "body" é obrigatório e não pode estar vazio');
    }
    if (body.length > 1024) {
      throw new Error('Body máximo de 1024 caracteres');
    }
    if (!buttons || !Array.isArray(buttons)) {
      throw new Error('O parâmetro "buttons" é obrigatório e deve ser um array');
    }
    if (buttons.length === 0) {
      throw new Error('É necessário pelo menos um botão');
    }
    if (buttons.length > 3) {
      throw new Error('Máximo de 3 botões permitidos');
    }

    // Valida IDs únicos
    const buttonIds = buttons.map(b => b.id.trim());
    const uniqueIds = new Set(buttonIds);
    if (buttonIds.length !== uniqueIds.size) {
      throw new Error('IDs dos botões devem ser únicos');
    }

    // Valida cada botão
    buttons.forEach((button, index) => {
      if (!button.id || !button.title) {
        throw new Error(`Botão ${index + 1}: "id" e "title" são obrigatórios`);
      }
      if (button.id.trim().length === 0) {
        throw new Error(`Botão ${index + 1}: ID não pode estar vazio`);
      }
      if (button.title.trim().length === 0) {
        throw new Error(`Botão ${index + 1}: Título não pode estar vazio`);
      }
      if (button.id.length > 256) {
        throw new Error(`Botão ${index + 1}: ID máximo de 256 caracteres`);
      }
      if (button.title.length > 20) {
        throw new Error(`Botão ${index + 1}: Título máximo de 20 caracteres`);
      }
    });

    // Valida header e footer
    if (header && header.length > 60) {
      throw new Error('Header máximo de 60 caracteres');
    }
    if (footer && footer.length > 60) {
      throw new Error('Footer máximo de 60 caracteres');
    }

    const phoneNumber = this._validatePhoneNumber(to);

    // Constrói o objeto interactive
    const interactiveData = {
      type: 'button',
      body: {
        text: body
      }
    };

    // Adiciona header se fornecido
    if (header) {
      interactiveData.header = {
        type: 'text',
        text: header
      };
    }

    // Adiciona footer se fornecido
    if (footer) {
      interactiveData.footer = {
        text: footer
      };
    }

    // Constrói os botões (usa trimmed values)
    const actionButtons = buttons.map(button => ({
      type: 'reply',
      reply: {
        id: button.id.trim(),
        title: button.title.trim()
      }
    }));

    interactiveData.action = {
      buttons: actionButtons
    };

    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'interactive',
      interactive: interactiveData
    };

    return await this._makeRequest('/messages', data);
  }

  /**
   * Marca uma mensagem como lida
   * @param {string} messageId - ID da mensagem
   * @returns {Promise<Object>} Resposta da API
   */
  async markAsRead(messageId) {
    if (!messageId) {
      throw new Error('O parâmetro "messageId" é obrigatório');
    }

    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    };

    return await this._makeRequest('/messages', data);
  }
}

module.exports = WhatsAppClient;
