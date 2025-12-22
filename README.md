# WhatsApp Cloud API - Biblioteca Node.js

Biblioteca Node.js para facilitar o uso da WhatsApp Cloud API da Meta.

## 📋 Características

- ✅ Envio de mensagens de texto
- ✅ Envio de imagens (com ou sem legenda)
- ✅ Envio de vídeos (com ou sem legenda)
- ✅ Envio de documentos (com ou sem legenda)
- ✅ Envio de áudios
- ✅ Envio de botões interativos (Reply Buttons)
- ✅ Envio de mensagens com templates (modelos)
- ✅ Listagem de templates disponíveis
- ✅ Suporte a arquivos até 16MB
- ✅ Webhook para receber mensagens
- ✅ TypeScript definitions incluídas
- ✅ Fácil configuração e uso

## 📦 Instalação

```bash
npm install @thyagodantas/whatsapp-cloud-api
```

## 🚀 Uso Rápido

### Configuração Inicial

```javascript
const { WhatsAppClient } = require('@thyagodantas/whatsapp-cloud-api');

const client = new WhatsAppClient({
  phoneNumberId: 'SEU_PHONE_NUMBER_ID',
  accessToken: 'SEU_ACCESS_TOKEN'
});
```

### Enviar Mensagem de Texto

```javascript
await client.sendText({
  to: '5511999999999',
  text: 'Olá! Esta é uma mensagem de teste.'
});
```

### Enviar Imagem

```javascript
// Com URL
await client.sendImage({
  to: '5511999999999',
  imageUrl: 'https://exemplo.com/imagem.jpg',
  caption: 'Legenda da imagem'
});

// Com arquivo local
await client.sendImage({
  to: '5511999999999',
  imagePath: './caminho/para/imagem.jpg',
  caption: 'Legenda da imagem'
});
```

### Enviar Vídeo

```javascript
// Com URL
await client.sendVideo({
  to: '5511999999999',
  videoUrl: 'https://exemplo.com/video.mp4',
  caption: 'Legenda do vídeo'
});

// Com arquivo local
await client.sendVideo({
  to: '5511999999999',
  videoPath: './caminho/para/video.mp4',
  caption: 'Legenda do vídeo'
});
```

### Enviar Documento

```javascript
// Com URL
await client.sendDocument({
  to: '5511999999999',
  documentUrl: 'https://exemplo.com/documento.pdf',
  caption: 'Documento importante',
  filename: 'documento.pdf'
});

// Com arquivo local
await client.sendDocument({
  to: '5511999999999',
  documentPath: './caminho/para/documento.pdf',
  caption: 'Documento importante',
  filename: 'documento.pdf'
});
```

### Enviar Áudio

```javascript
// Com URL
await client.sendAudio({
  to: '5511999999999',
  audioUrl: 'https://exemplo.com/audio.mp3'
});

// Com arquivo local
await client.sendAudio({
  to: '5511999999999',
  audioPath: './caminho/para/audio.mp3'
});
```

### Enviar Botões Interativos

```javascript
// Botões simples
await client.sendButtons({
  to: '5511999999999',
  body: 'Escolha uma opção abaixo:',
  buttons: [
    { id: 'btn_sim', title: 'Sim' },
    { id: 'btn_nao', title: 'Não' },
    { id: 'btn_talvez', title: 'Talvez' }
  ]
});

// Botões com header e footer
await client.sendButtons({
  to: '5511999999999',
  header: '🎉 Promoção Especial',
  body: 'Gostaria de aproveitar nossa oferta exclusiva?',
  buttons: [
    { id: 'btn_aceitar', title: 'Aceitar Oferta' },
    { id: 'btn_recusar', title: 'Não, obrigado' }
  ],
  footer: 'Oferta válida por tempo limitado'
});
```

### Listar Templates Disponíveis

```javascript
// Listar todos os templates aprovados
const templates = await client.listTemplates({
  status: 'APPROVED',
  limit: 50
});

console.log('Templates disponíveis:', templates.data);

// Listar todos os templates (sem filtro)
const allTemplates = await client.listTemplates();
```

### Enviar Mensagem com Template

```javascript
// Template simples (sem variáveis)
await client.sendTemplate({
  to: '5511999999999',
  templateName: 'hello_world',
  languageCode: 'pt_BR'
});

// Template com variáveis no body
await client.sendTemplate({
  to: '5511999999999',
  templateName: 'welcome_message',
  languageCode: 'pt_BR',
  components: [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'João Silva' },
        { type: 'text', text: '15/12/2024' }
      ]
    }
  ]
});

// Template com header de imagem e variáveis
await client.sendTemplate({
  to: '5511999999999',
  templateName: 'promotional_offer',
  languageCode: 'pt_BR',
  components: [
    {
      type: 'header',
      parameters: [
        {
          type: 'image',
          image: { link: 'https://exemplo.com/promo.jpg' }
        }
      ]
    },
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'Black Friday' },
        { type: 'text', text: '50%' }
      ]
    }
  ]
});

// Template com botões
await client.sendTemplate({
  to: '5511999999999',
  templateName: 'order_confirmation',
  languageCode: 'pt_BR',
  components: [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: '#12345' }
      ]
    },
    {
      type: 'button',
      sub_type: 'url',
      index: 0,
      parameters: [
        { type: 'text', text: '12345' }
      ]
    }
  ]
});
```

## 🔔 Webhook para Receber Mensagens

### Configuração com Express

```javascript
const express = require('express');
const { WebhookHandler } = require('@thyagodantas/whatsapp-cloud-api');

const app = express();

const webhookHandler = new WebhookHandler({
  verifyToken: 'SEU_VERIFY_TOKEN'
});

// Rota de verificação do webhook
app.get('/webhook', (req, res) => {
  webhookHandler.verify(req, res);
});

// Rota para receber mensagens
app.post('/webhook', express.json(), (req, res) => {
  webhookHandler.handle(req, res, (message) => {
    console.log('Mensagem recebida:', message);
    
    // Processar a mensagem aqui
    if (message.type === 'text') {
      console.log('Texto:', message.text.body);
    } else if (message.type === 'image') {
      console.log('Imagem ID:', message.image.id);
    }
  });
});

app.listen(3000, () => {
  console.log('Webhook rodando na porta 3000');
});
```

## 📚 API Reference

### WhatsAppClient

#### Constructor

```javascript
new WhatsAppClient(config)
```

**Parâmetros:**
- `config.phoneNumberId` (string): ID do número de telefone do WhatsApp Business
- `config.accessToken` (string): Token de acesso da API
- `config.apiVersion` (string, opcional): Versão da API (padrão: 'v18.0')

#### Métodos

##### sendText(options)

Envia uma mensagem de texto.

**Parâmetros:**
- `options.to` (string): Número do destinatário (formato internacional)
- `options.text` (string): Texto da mensagem

**Retorna:** Promise<Object>

##### sendImage(options)

Envia uma imagem.

**Parâmetros:**
- `options.to` (string): Número do destinatário
- `options.imageUrl` (string, opcional): URL da imagem
- `options.imagePath` (string, opcional): Caminho local da imagem
- `options.caption` (string, opcional): Legenda da imagem

**Retorna:** Promise<Object>

##### sendVideo(options)

Envia um vídeo.

**Parâmetros:**
- `options.to` (string): Número do destinatário
- `options.videoUrl` (string, opcional): URL do vídeo
- `options.videoPath` (string, opcional): Caminho local do vídeo
- `options.caption` (string, opcional): Legenda do vídeo

**Retorna:** Promise<Object>

##### sendDocument(options)

Envia um documento.

**Parâmetros:**
- `options.to` (string): Número do destinatário
- `options.documentUrl` (string, opcional): URL do documento
- `options.documentPath` (string, opcional): Caminho local do documento
- `options.caption` (string, opcional): Legenda do documento
- `options.filename` (string, opcional): Nome do arquivo

**Retorna:** Promise<Object>

##### sendAudio(options)

Envia um áudio.

**Parâmetros:**
- `options.to` (string): Número do destinatário
- `options.audioUrl` (string, opcional): URL do áudio
- `options.audioPath` (string, opcional): Caminho local do áudio

**Formatos suportados:** AAC, AMR, MP3, M4A, OGG, OPUS

**Retorna:** Promise<Object>

##### sendButtons(options)

Envia botões interativos (Reply Buttons).

**Parâmetros:**
- `options.to` (string): Número do destinatário
- `options.body` (string): Texto principal da mensagem
- `options.buttons` (Array): Array de botões (máximo 3)
  - `buttons[].id` (string): ID único do botão (máx 256 caracteres)
  - `buttons[].title` (string): Título do botão (máx 20 caracteres)
- `options.header` (string, opcional): Texto do cabeçalho (máx 60 caracteres)
- `options.footer` (string, opcional): Texto do rodapé (máx 60 caracteres)

**Retorna:** Promise<Object>

##### listTemplates(options)

Lista todos os templates (modelos) de mensagens disponíveis.

**Parâmetros:**
- `options.status` (string, opcional): Filtrar por status ('APPROVED', 'PENDING', 'REJECTED')
- `options.limit` (number, opcional): Limite de resultados por página (padrão: 100)

**Retorna:** Promise<Object>
```javascript
{
  data: [
    {
      name: 'hello_world',
      components: [...],
      language: 'pt_BR',
      status: 'APPROVED',
      category: 'UTILITY',
      id: '123456789'
    }
  ],
  paging: { ... }
}
```

##### sendTemplate(options)

Envia uma mensagem usando um template (modelo).

**Parâmetros:**
- `options.to` (string): Número do destinatário
- `options.templateName` (string): Nome do template
- `options.languageCode` (string): Código do idioma (ex: 'pt_BR', 'en_US', 'es')
- `options.components` (Array, opcional): Componentes do template
  - `components[].type` (string): Tipo do componente ('header', 'body', 'button')
  - `components[].parameters` (Array): Parâmetros do componente
    - `type` (string): Tipo do parâmetro ('text', 'image', 'video', 'document')
    - `text` (string): Texto do parâmetro (para type='text')
    - `image/video/document` (Object): Objeto com link (para tipos de mídia)

**Códigos de idioma comuns:**
- `pt_BR` - Português (Brasil)
- `en_US` - Inglês (Estados Unidos)
- `es` - Espanhol
- `en` - Inglês

**Retorna:** Promise<Object>

### WebhookHandler

#### Constructor

```javascript
new WebhookHandler(config)
```

**Parâmetros:**
- `config.verifyToken` (string): Token de verificação do webhook

#### Métodos

##### verify(req, res)

Verifica o webhook durante a configuração.

##### handle(req, res, callback)

Processa mensagens recebidas.

**Parâmetros:**
- `req`: Request do Express
- `res`: Response do Express
- `callback`: Função que recebe o objeto da mensagem

## 🔑 Obtendo Credenciais

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um app e adicione o produto WhatsApp
3. Obtenha o `Phone Number ID` e o `Access Token`
4. Configure o webhook com seu `Verify Token`

## 📝 Limitações

- Tamanho máximo de arquivo: 16MB
- Formatos suportados variam por tipo de mídia (consulte a documentação oficial)

## 🔗 Links Úteis

- [Documentação Oficial WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Exemplos Oficiais](https://github.com/fbsamples/whatsapp-api-examples)

## 📄 Licença

MIT
