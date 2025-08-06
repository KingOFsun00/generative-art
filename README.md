# 🎨 Gerador de Arte Generativa

Uma aplicação web moderna que transforma suas ideias em obras de arte únicas usando inteligência artificial e efeitos algorítmicos avançados.

## ✨ Funcionalidades

### 🎯 **Efeitos Artísticos**
- **Impressionista**: Pinceladas suaves e cores vibrantes
- **Aquarela**: Efeito de sangramento e transparência
- **Pintura a Óleo**: Textura densa e rica
- **Glitch Digital**: Distorções e falhas digitais
- **Mosaico**: Composição em blocos coloridos
- **Esboço**: Conversão para desenho a lápis
- **Pop Art**: Cores saturadas e posterização
- **Abstrato**: Formas geométricas sobrepostas

### ⚙️ **Controles Avançados**
- **Intensidade**: Controla a força do efeito aplicado
- **Variação de Cor**: Ajusta a diversidade cromática
- **Tamanho do Pincel**: Define o tamanho dos elementos
- **Complexidade**: Controla a quantidade de detalhes

### 🚀 **Recursos Modernos**
- Interface responsiva e elegante
- Histórico de criações
- Sistema de curtidas e visualizações
- Temas populares com um clique
- Compartilhamento nativo
- Notificações toast
- Salvamento de preferências

## 🛠️ Tecnologias Utilizadas

- **HTML5 Canvas** para renderização gráfica
- **JavaScript ES6+** para lógica da aplicação
- **CSS3** com variáveis customizadas e gradientes
- **Unsplash API** para imagens de alta qualidade
- **Lucide Icons** para ícones modernos
- **LocalStorage** para persistência de dados

## 🚀 Como Usar

### Hospedagem no GitHub Pages

1. **Fork este repositório**
2. **Vá para Settings > Pages**
3. **Selecione "Deploy from a branch"**
4. **Escolha "main" branch e "/ (root)"**
5. **Clique em "Save"**
6. **Acesse sua aplicação em: `https://seuusuario.github.io/nome-do-repo`**

### Uso Local

1. **Clone o repositório**:
   \`\`\`bash
   git clone https://github.com/seuusuario/gerador-arte-generativa.git
   cd gerador-arte-generativa
   \`\`\`

2. **Abra o arquivo `index.html` em qualquer navegador moderno**

### Como Criar Arte

1. **Digite um tema** na caixa de pesquisa (ex: "floresta mística", "cidade cyberpunk")
2. **Escolha um efeito artístico** na barra lateral
3. **Ajuste as configurações** conforme desejado
4. **Clique em "Gerar Arte"** ou pressione Enter
5. **Use "Tema Aleatório"** para inspiração
6. **Salve sua criação** clicando em "Salvar"

## 🎨 Exemplos de Temas

- `floresta mística com cogumelos brilhantes`
- `paisagem cyberpunk com luzes neon`
- `templo antigo nas montanhas nebulosas`
- `recife de coral subaquático`
- `nebulosa espacial com galáxias distantes`
- `jardim zen japonês no outono`
- `maquinário steampunk com engrenagens`
- `aurora boreal sobre lago congelado`
- `oásis no deserto com palmeiras`
- `ilhas flutuantes nas nuvens`

## 🎯 Algoritmos Implementados

### Efeito Impressionista
- Análise de pixels para extração de cores
- Geração de pinceladas elípticas com rotação aleatória
- Variação de matiz baseada em configurações
- Composição multiplicativa para profundidade

### Efeito Aquarela
- Gradientes radiais para simular sangramento
- Múltiplas camadas de transparência
- Distribuição aleatória de "gotas" de tinta
- Mistura de cores orgânica

### Efeito Glitch Digital
- Deslocamento horizontal de linhas
- Separação de canais RGB
- Blocos de pixels corrompidos
- Ruído digital procedural

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móveis (iOS/Android)

## 🔧 Configuração da API

A aplicação usa a API do Unsplash para buscar imagens. A chave de API já está incluída para demonstração, mas para uso em produção, recomenda-se:

1. Criar uma conta no [Unsplash Developers](https://unsplash.com/developers)
2. Registrar uma nova aplicação
3. Substituir a chave em `script.js`:

\`\`\`javascript
const CONFIG = {
    unsplashAccessKey: 'SUA_CHAVE_AQUI',
    // ...
};
\`\`\`

## 🎨 Personalização

### Adicionando Novos Efeitos

1. **Adicione o efeito ao array de configuração**:
\`\`\`javascript
CONFIG.artisticEffects.push({
    id: 'meu-efeito',
    name: 'Meu Efeito',
    icon: '🎭'
});
\`\`\`

2. **Implemente a função do efeito**:
\`\`\`javascript
function applyMeuEfeito(ctx, canvas, intensity, colorVariance) {
    // Sua lógica aqui
}
\`\`\`

3. **Adicione ao switch case**:
\`\`\`javascript
case 'meu-efeito':
    applyMeuEfeito(ctx, canvas, intensity, colorVariance);
    break;
\`\`\`

### Modificando Cores e Estilos

Edite as variáveis CSS em `styles.css`:

\`\`\`css
:root {
    --primary: #8b5cf6;    /* Cor principal */
    --secondary: #06b6d4;  /* Cor secundária */
    --accent: #3b82f6;     /* Cor de destaque */
    /* ... */
}
\`\`\`

## 🚀 Deploy e Otimização

### GitHub Pages
- Funciona imediatamente após push
- HTTPS automático
- CDN global do GitHub

### Otimizações Implementadas
- Lazy loading de imagens
- Debouncing em inputs
- Cache de preferências no localStorage
- Compressão de canvas para download
- Responsive design otimizado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [Unsplash](https://unsplash.com) pelas imagens de alta qualidade
- [Lucide](https://lucide.dev) pelos ícones modernos
- [Inter Font](https://rsms.me/inter/) pela tipografia elegante

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões:

1. Abra uma [Issue](https://github.com/seuusuario/gerador-arte-generativa/issues)
2. Descreva o problema detalhadamente
3. Inclua screenshots se possível
4. Mencione seu navegador e sistema operacional

---

**Criado com ❤️ para a comunidade de arte digital**
