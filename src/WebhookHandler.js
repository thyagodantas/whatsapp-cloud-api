const crypto = require('crypto');

/**
 * Handler para webhooks do WhatsApp Cloud API
 */
class WebhookHandler {
  /**
   * @param {Object} config - Configuração do webhook
   * @param {string} config.verifyToken - Token de verificação do webhook
   * @param {string} [config.appSecret] - App Secret para validação de assinatura (opcional mas recomendado)
   */
  constructor(config) {
    if (!config.verifyToken) {
      throw new Error('verifyToken é obrigatório');
    }

    this.verifyToken = config.verifyToken;
    this.appSecret = config.appSecret;
  }

  /**
   * Verifica o webhook durante a configuração inicial
   * @param {Object} req - Request do Express
   * @param {Object} res - Response do Express
   */
  verify(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === this.verifyToken) {
        console.log('Webhook verificado com sucesso!');
        res.status(200).send(challenge);
      } else {
        console.error('Falha na verificação do webhook: token inválido');
        res.sendStatus(403);
      }
    } else {
      console.error('Falha na verificação do webhook: parâmetros ausentes');
      res.sendStatus(400);
    }
  }

  /**
   * Valida a assinatura do webhook (opcional mas recomendado para segurança)
   * @private
   */
  _validateSignature(req) {
    if (!this.appSecret) {
      return true; // Se não configurado, pula a validação
    }

    const signature = req.headers['x-hub-signature-256'];
    
    if (!signature) {
      console.warn('Assinatura do webhook não encontrada');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.appSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    const signatureHash = signature.split('sha256=')[1];

    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Extrai informações da mensagem recebida
   * @private
   */
  _extractMessage(entry) {
    const changes = entry.changes;
    
    if (!changes || changes.length === 0) {
      return null;
    }

    const change = changes[0];
    const value = change.value;

    if (!value.messages || value.messages.length === 0) {
      return null;
    }

    const message = value.messages[0];
    const metadata = value.metadata;
    const contacts = value.contacts;

    // Estrutura base da mensagem
    const extractedMessage = {
      messageId: message.id,
      from: message.from,
      timestamp: message.timestamp,
      type: message.type,
      phoneNumberId: metadata.phone_number_id,
      displayPhoneNumber: metadata.display_phone_number
    };

    // Adiciona informações do contato se disponível
    if (contacts && contacts.length > 0) {
      extractedMessage.contact = {
        name: contacts[0].profile?.name,
        waId: contacts[0].wa_id
      };
    }

    // Extrai conteúdo baseado no tipo de mensagem
    switch (message.type) {
      case 'text':
        extractedMessage.text = {
          body: message.text.body
        };
        break;

      case 'image':
        extractedMessage.image = {
          id: message.image.id,
          mimeType: message.image.mime_type,
          sha256: message.image.sha256,
          caption: message.image.caption
        };
        break;

      case 'video':
        extractedMessage.video = {
          id: message.video.id,
          mimeType: message.video.mime_type,
          sha256: message.video.sha256,
          caption: message.video.caption
        };
        break;

      case 'document':
        extractedMessage.document = {
          id: message.document.id,
          mimeType: message.document.mime_type,
          sha256: message.document.sha256,
          filename: message.document.filename,
          caption: message.document.caption
        };
        break;

      case 'audio':
        extractedMessage.audio = {
          id: message.audio.id,
          mimeType: message.audio.mime_type,
          sha256: message.audio.sha256
        };
        break;

      case 'location':
        extractedMessage.location = {
          latitude: message.location.latitude,
          longitude: message.location.longitude,
          name: message.location.name,
          address: message.location.address
        };
        break;

      case 'contacts':
        extractedMessage.contacts = message.contacts;
        break;

      case 'button':
        extractedMessage.button = {
          text: message.button.text,
          payload: message.button.payload
        };
        break;

      case 'interactive':
        if (message.interactive.type === 'button_reply') {
          extractedMessage.interactive = {
            type: 'button_reply',
            buttonReply: {
              id: message.interactive.button_reply.id,
              title: message.interactive.button_reply.title
            }
          };
        } else if (message.interactive.type === 'list_reply') {
          extractedMessage.interactive = {
            type: 'list_reply',
            listReply: {
              id: message.interactive.list_reply.id,
              title: message.interactive.list_reply.title,
              description: message.interactive.list_reply.description
            }
          };
        }
        break;
    }

    return extractedMessage;
  }

  /**
   * Extrai informações de status de mensagem
   * @private
   */
  _extractStatus(entry) {
    const changes = entry.changes;
    
    if (!changes || changes.length === 0) {
      return null;
    }

    const change = changes[0];
    const value = change.value;

    if (!value.statuses || value.statuses.length === 0) {
      return null;
    }

    const status = value.statuses[0];

    return {
      messageId: status.id,
      status: status.status,
      timestamp: status.timestamp,
      recipientId: status.recipient_id,
      conversation: status.conversation,
      pricing: status.pricing
    };
  }

  /**
   * Processa mensagens recebidas do webhook
   * @param {Object} req - Request do Express
   * @param {Object} res - Response do Express
   * @param {Function} callback - Função callback que recebe a mensagem processada
   */
  handle(req, res, callback) {
    // Valida a assinatura se o appSecret estiver configurado
    if (this.appSecret && !this._validateSignature(req)) {
      console.error('Assinatura do webhook inválida');
      return res.sendStatus(403);
    }

    const body = req.body;

    // Verifica se é uma notificação do WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    // Processa cada entrada
    if (body.entry && body.entry.length > 0) {
      const promises = [];
      
      body.entry.forEach(entry => {
        // Tenta extrair mensagem
        const message = this._extractMessage(entry);
        if (message) {
          const result = callback(message);
          if (result && typeof result.then === 'function') {
            promises.push(result);
          }
        }

        // Tenta extrair status
        const status = this._extractStatus(entry);
        if (status) {
          const result = callback(status);
          if (result && typeof result.then === 'function') {
            promises.push(result);
          }
        }
      });

      // Espera todas as operações assíncronas terminarem
      if (promises.length > 0) {
        Promise.all(promises)
          .then(() => res.sendStatus(200))
          .catch(error => {
            console.error('Erro ao processar webhook:', error);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(200);
      }
    } else {
      res.sendStatus(200);
    }
  }

  /**
   * Processa apenas mensagens (ignora status)
   * @param {Object} req - Request do Express
   * @param {Object} res - Response do Express
   * @param {Function} callback - Função callback que recebe a mensagem processada
   */
  handleMessages(req, res, callback) {
    this.handle(req, res, (data) => {
      // Só chama o callback se for uma mensagem (não status)
      if (data.type) {
        callback(data);
      }
    });
  }

  /**
   * Processa apenas status de mensagens (ignora mensagens recebidas)
   * @param {Object} req - Request do Express
   * @param {Object} res - Response do Express
   * @param {Function} callback - Função callback que recebe o status processado
   */
  handleStatus(req, res, callback) {
    this.handle(req, res, (data) => {
      // Só chama o callback se for um status (não mensagem)
      if (data.status) {
        callback(data);
      }
    });
  }
}

module.exports = WebhookHandler;
