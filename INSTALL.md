# 📦 Guia de Instalação

## 🎯 Instalação da Biblioteca

### Como Dependência em Seu Projeto

```bash
npm install @thyagodantas/whatsapp-cloud-api
```

### Para Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/thyagodantas/@thyagodantas/whatsapp-cloud-api.git
cd @thyagodantas/whatsapp-cloud-api

# Instale as dependências principais
npm install
```

## 🔧 Instalação de Dependências dos Exemplos

Os exemplos requerem dependências adicionais que não são necessárias para usar a biblioteca.

### Opção 1: Instalação Automática

```bash
cd examples
npm install
```

Isso instalará:
- `express` - Framework web para webhooks
- `dotenv` - Gerenciamento de variáveis de ambiente

### Opção 2: Instalação Manual

```bash
npm install express dotenv
```

### Para Exemplos TypeScript

```bash
cd examples
npm run install:ts
```

Isso instalará adicionalmente:
- `typescript` - Compilador TypeScript
- `@types/node` - Types do Node.js
- `@types/express` - Types do Express

## 🌍 Configuração de Ambiente

### 1. Copie o arquivo de exemplo

```bash
cp .env.example .env
```

### 2. Configure suas credenciais

Edite o arquivo `.env`:

```env
# Obtenha estas credenciais no Facebook Developers
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
WHATSAPP_API_VERSION=v18.0

# Crie um token seguro para verificação do webhook
WEBHOOK_VERIFY_TOKEN=seu_verify_token_aqui

# Opcional: Para validação de assinatura (recomendado)
WEBHOOK_APP_SECRET=seu_app_secret_aqui

# Porta do servidor
PORT=3000
```

## 🔑 Obtendo Credenciais

### Phone Number ID e Access Token

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Vá para seu app (ou crie um novo)
3. Adicione o produto "WhatsApp"
4. Vá em "WhatsApp" > "API Setup"
5. Copie:
   - **Phone Number ID**
   - **Temporary access token** (válido por 24h)

### Token Permanente (Produção)

1. Acesse o [Business Manager](https://business.facebook.com/)
2. Vá em "Configurações do Negócio" > "Usuários do Sistema"
3. Crie um novo System User
4. Adicione o app ao System User
5. Gere um token com as permissões:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`

### Verify Token

Você mesmo cria este token. Pode ser qualquer string segura:

```
meu_token_super_secreto_123
```

Use o mesmo token ao configurar o webhook no Facebook Developers.

### App Secret

1. No Facebook Developers, vá em "Configurações" > "Básico"
2. Copie o "Chave Secreta do App"
3. Use para validar a assinatura do webhook (segurança adicional)

## ✅ Verificação da Instalação

### Teste Básico

Crie um arquivo `test.js`:

```javascript
const { WhatsAppClient } = require('@thyagodantas/whatsapp-cloud-api');

const client = new WhatsAppClient({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN
});

console.log('✅ Biblioteca instalada e configurada com sucesso!');
```

Execute:
```bash
node test.js
```

### Teste de Envio

```javascript
require('dotenv').config();
const { WhatsAppClient } = require('@thyagodantas/whatsapp-cloud-api');

const client = new WhatsAppClient({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN
});

async function testar() {
  try {
    await client.sendText({
      to: '5511999999999', // Seu número
      text: 'Teste de instalação! 🎉'
    });
    console.log('✅ Mensagem enviada com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testar();
```

## 🚀 Executando os Exemplos

### Envio de Mensagens

```bash
node examples/send-messages.js
```

Ou:
```bash
npm run example:send
```

### Servidor Webhook

```bash
node examples/webhook-server.js
```

Ou:
```bash
npm run example:webhook
```

### Servidor Avançado (com .env)

```bash
node examples/advanced-webhook.js
```

Ou:
```bash
npm run example:advanced
```

### Exemplo TypeScript

```bash
# Compile e execute
cd examples
npx tsc typescript-example.ts
node typescript-example.js
```

Ou:
```bash
cd examples
npm run start:ts
```

## 🌐 Expondo Webhook Localmente

Para testar webhooks localmente, use o ngrok:

### Instalar ngrok

```bash
npm install -g ngrok
```

Ou baixe em [ngrok.com](https://ngrok.com/)

### Usar ngrok

```bash
# Em um terminal, inicie seu servidor
node examples/webhook-server.js

# Em outro terminal, exponha a porta
ngrok http 3000
```

O ngrok fornecerá uma URL pública:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

Use `https://abc123.ngrok.io/webhook` para configurar no Facebook Developers.

## 🐛 Problemas Comuns

### "Cannot find module 'whatsapp-cloud-api'"

**Solução**: Instale a biblioteca
```bash
npm install @thyagodantas/whatsapp-cloud-api
```

### "Cannot find module 'express'"

**Solução**: Instale as dependências dos exemplos
```bash
npm install express dotenv
```

### "phoneNumberId é obrigatório"

**Solução**: Configure o arquivo `.env` com suas credenciais

### "ENOENT: no such file or directory, open '.env'"

**Solução**: Copie o arquivo de exemplo
```bash
cp .env.example .env
```

### Erro ao enviar mensagem

**Possíveis causas**:
1. Access Token inválido ou expirado
2. Phone Number ID incorreto
3. Número de destino em formato inválido
4. Permissões insuficientes

**Solução**: Verifique suas credenciais e o formato do número (ex: `5511999999999`)

## 📚 Próximos Passos

Após a instalação:

1. ✅ Leia o [QUICKSTART.md](QUICKSTART.md)
2. ✅ Explore os [exemplos](examples/)
3. ✅ Consulte a [documentação completa](README.md)
4. ✅ Configure o webhook
5. ✅ Comece a desenvolver!

## 🆘 Suporte

Se encontrar problemas:

1. Verifique a [documentação](README.md)
2. Consulte os [exemplos](examples/)
3. Leia o [guia de início rápido](QUICKSTART.md)
4. Abra uma issue no GitHub

---

**Dica**: Mantenha suas credenciais seguras e nunca as commite no Git!
