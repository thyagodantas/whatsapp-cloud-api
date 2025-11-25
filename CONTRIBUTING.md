# 🤝 Contribuindo

Obrigado por considerar contribuir com a biblioteca WhatsApp Cloud API!

## 🐛 Reportando Bugs

Se você encontrou um bug, por favor abra uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Versão do Node.js
- Código de exemplo (se possível)

## 💡 Sugerindo Melhorias

Sugestões são bem-vindas! Abra uma issue descrevendo:

- O problema que a melhoria resolve
- Como você imagina a solução
- Exemplos de uso

## 🔧 Desenvolvendo

### Setup do Ambiente

```bash
# Clone o repositório
git clone https://github.com/thyagodantas/whatsapp-cloud-api.git
cd @thyagodantas/whatsapp-cloud-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Estrutura do Projeto

```
@thyagodantas/whatsapp-cloud-api/
├── src/
│   ├── WhatsAppClient.js    # Cliente principal
│   ├── WebhookHandler.js    # Handler de webhooks
│   ├── index.js             # Exports principais
│   └── index.d.ts           # TypeScript definitions
├── examples/                 # Exemplos de uso
├── README.md                # Documentação principal
├── QUICKSTART.md            # Guia de início rápido
└── package.json
```

### Padrões de Código

- Use JavaScript ES6+
- Documente funções públicas com JSDoc
- Mantenha compatibilidade com Node.js 14+
- Siga o estilo de código existente

### Testando

Antes de enviar um PR:

1. Teste manualmente suas alterações
2. Verifique se não quebrou funcionalidades existentes
3. Teste com diferentes tipos de mensagens
4. Valide com o webhook

### Enviando Pull Request

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Checklist do PR

- [ ] Código segue os padrões do projeto
- [ ] Documentação atualizada (se necessário)
- [ ] Exemplos adicionados/atualizados (se necessário)
- [ ] TypeScript definitions atualizadas (se necessário)
- [ ] Testado manualmente

## 🎯 Áreas que Precisam de Ajuda

- Testes automatizados
- Mais exemplos de uso
- Melhorias na documentação
- Suporte a mais tipos de mensagens
- Tratamento de erros

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT.
