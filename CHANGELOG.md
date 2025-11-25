# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.1] - 2024-11-25

### Adicionado
- Cliente WhatsApp Cloud API (`WhatsAppClient`)
- Envio de mensagens de texto
- Envio de imagens (URL e arquivo local)
- Envio de vídeos (URL e arquivo local)
- Envio de documentos (URL e arquivo local)
- **Envio de botões interativos (Reply Buttons)**
  - Suporte a até 3 botões por mensagem
  - Header e footer opcionais
  - Validação completa (IDs únicos, limites de caracteres)
  - Suporte a cliques em botões via webhook
- Suporte a legendas em mídias
- Validação de tamanho de arquivo (máx 16MB)
- Upload automático de arquivos locais
- Handler de webhook (`WebhookHandler`)
- Verificação do webhook
- Recebimento de mensagens
- Recebimento de status de mensagens
- Validação de assinatura do webhook (segurança)
- Suporte a múltiplos tipos de mensagens:
  - Texto
  - Imagem
  - Vídeo
  - Documento
  - Áudio
  - Localização
  - Contatos
  - Botões
  - Mensagens interativas
- Função para marcar mensagens como lidas
- TypeScript definitions completas
- Exemplos de uso:
  - Envio de mensagens
  - **Envio de botões interativos**
  - Servidor webhook básico
  - **Servidor webhook avançado com suporte a botões**
  - Exemplo TypeScript
- Documentação completa:
  - README principal
  - Guia de início rápido
  - Documentação de exemplos
  - Guia de contribuição
- Configuração de ambiente (.env.example)
- Licença MIT

### Características
- Fácil de usar e configurar
- Suporte a Node.js 14+
- Tratamento de erros robusto
- Validação de entrada
- Logging detalhado
- Compatível com Express.js
- Type-safe com TypeScript

[1.0.1]: https://github.com/thyagodantas/whatsapp-cloud-api/releases/tag/v1.0.1
