# 🚀 Guia de Início Rápido

Este guia vai te ajudar a começar a usar a biblioteca WhatsApp Cloud API em poucos minutos.

## 📋 Pré-requisitos

1. **Conta no Facebook Developers**
   - Acesse [developers.facebook.com](https://developers.facebook.com/)
   - Crie uma conta se ainda não tiver

2. **App do WhatsApp Business**
   - Crie um novo app ou use um existente
   - Adicione o produto "WhatsApp"

3. **Node.js**
   - Versão 14 ou superior

## 🔧 Instalação

```bash
npm install @thyagodantas/whatsapp-cloud-api
```

Para usar os exemplos com webhook, instale também:

```bash
npm install express dotenv
```

## 🔑 Obtendo Credenciais

### 1. Phone Number ID

1. No Facebook Developers, vá para seu app
2. Clique em "WhatsApp" > "API Setup"
3. Copie o **Phone Number ID**

### 2. Access Token

Na mesma página "API Setup":
1. Copie o **Temporary access token** (válido por 24h)
2. Para produção, gere um **Permanent token**:
   - Vá em "System Users" no Business Manager
   - Crie um System User
   - Gere um token com as permissões necessárias

### 3. Verify Token (para webhook)

Você mesmo cria este token. Pode ser qualquer string:
```
meu_token_secreto_123
```

## 📝 Primeiro Código

### Enviar uma Mensagem de Texto

Crie um arquivo `test.js`:

```javascript
const { WhatsAppClient } = require('@thyagodantas/whatsapp-cloud-api');

const client = new WhatsAppClient({
  phoneNumberId: 'SEU_PHONE_NUMBER_ID',
  accessToken: 'SEU_ACCESS_TOKEN'
});

async function enviarMensagem() {
  try {
    const response = await client.sendText({
      to: '5511999999999', // Número no formato internacional
      text: 'Olá! Esta é minha primeira mensagem via API! 🎉'
    });
    
    console.log('✅ Mensagem enviada!');
    console.log('ID:', response.messages[0].id);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

enviarMensagem();
```

Execute:
```bash
node test.js
```

## 📸 Enviando Mídia

### Imagem

```javascript
// Por URL
await client.sendImage({
  to: '5511999999999',
  imageUrl: 'https://exemplo.com/imagem.jpg',
  caption: 'Confira esta imagem!'
});

// Arquivo local
await client.sendImage({
  to: '5511999999999',
  imagePath: './foto.jpg',
  caption: 'Foto do arquivo local'
});
```

### Vídeo

```javascript
await client.sendVideo({
  to: '5511999999999',
  videoUrl: 'https://exemplo.com/video.mp4',
  caption: 'Assista este vídeo!'
});
```

### Documento

```javascript
await client.sendDocument({
  to: '5511999999999',
  documentPath: './contrato.pdf',
  caption: 'Segue o contrato',
  filename: 'contrato_2024.pdf'
});
```

## 🔔 Configurando Webhook

### 1. Criar Servidor

Crie um arquivo `webhook.js`:

```javascript
const express = require('express');
const { WebhookHandler } = require('@thyagodantas/whatsapp-cloud-api');

const app = express();

const webhookHandler = new WebhookHandler({
  verifyToken: 'meu_token_secreto_123'
});

// Verificação do webhook
app.get('/webhook', (req, res) => {
  webhookHandler.verify(req, res);
});

// Receber mensagens
app.post('/webhook', express.json(), (req, res) => {
  webhookHandler.handle(req, res, (message) => {
    console.log('Mensagem recebida:', message);
    
    if (message.type === 'text') {
      console.log('Texto:', message.text.body);
    }
  });
});

app.listen(3000, () => {
  console.log('Webhook rodando na porta 3000');
});
```

### 2. Expor Localmente com ngrok

```bash
# Instalar ngrok
npm install -g ngrok

# Executar o servidor
node webhook.js

# Em outro terminal, expor a porta
ngrok http 3000
```

O ngrok vai gerar uma URL pública, por exemplo:
```
https://abc123.ngrok.io
```

### 3. Configurar no Facebook

1. No Facebook Developers, vá em "WhatsApp" > "Configuration"
2. Clique em "Edit" no Webhook
3. Configure:
   - **Callback URL**: `https://abc123.ngrok.io/webhook`
   - **Verify Token**: `meu_token_secreto_123`
4. Clique em "Verify and Save"
5. Inscreva-se nos campos: `messages`

## 🧪 Testando

### Enviar Mensagem de Teste

No WhatsApp, envie uma mensagem para o número configurado no app.

Você deve ver no console do seu servidor:
```
Mensagem recebida: { type: 'text', text: { body: 'Olá!' }, ... }
```

## 📚 Próximos Passos

1. **Explore os exemplos**
   ```bash
   npm run example:send
   npm run example:webhook
   npm run example:advanced
   ```

2. **Leia a documentação completa** no [README.md](./README.md)

3. **Use variáveis de ambiente**
   - Copie `.env.example` para `.env`
   - Configure suas credenciais
   - Use `require('dotenv').config()` no início do código

4. **Implemente lógica de negócio**
   - Responda automaticamente
   - Integre com banco de dados
   - Crie chatbots inteligentes

## ⚠️ Dicas Importantes

1. **Números no formato internacional**
   - ✅ Correto: `5511999999999`
   - ❌ Errado: `+55 11 99999-9999`

2. **Tamanho máximo de arquivos: 16MB**

3. **Token temporário expira em 24h**
   - Use tokens permanentes em produção

4. **Rate Limits**
   - Respeite os limites da API
   - Implemente retry logic

5. **Segurança**
   - Nunca commite tokens no Git
   - Use variáveis de ambiente
   - Configure o App Secret para validar webhooks

## 🆘 Problemas Comuns

### "phoneNumberId é obrigatório"
Você esqueceu de passar o `phoneNumberId` no construtor.

### "Número de telefone inválido"
Use o formato internacional sem caracteres especiais.

### "Arquivo muito grande"
O arquivo excede 16MB. Reduza o tamanho.

### "Webhook não recebe mensagens"
1. Verifique se o ngrok está rodando
2. Confirme que o webhook está configurado corretamente
3. Verifique se está inscrito no campo `messages`

## 📞 Suporte

- [Documentação Oficial WhatsApp](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Exemplos Oficiais](https://github.com/fbsamples/whatsapp-api-examples)
- Issues no GitHub do projeto

---

Feito com ❤️ para facilitar o uso da WhatsApp Cloud API
