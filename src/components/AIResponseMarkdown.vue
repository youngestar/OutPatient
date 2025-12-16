<template>
  <div v-html="safeHtml" class="ai-markdown"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'

const props = defineProps({
  text: { type: String, required: true },
})

// Create markdown-it instance with highlight function
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value
      }
      return hljs.highlightAuto(str).value
    } catch {
      return '' // fallback to no highlight
    }
  }
})

// Typed wrapper for sanitizer hooks to avoid using `any` and satisfy ESLint
type SanitizeHook = {
  addHook?: (hookName: string, cb: (node: Element) => void) => void
}
const sanitizer = DOMPurify as unknown as SanitizeHook

if (sanitizer.addHook) {
  try {
    sanitizer.addHook('afterSanitizeAttributes', (node: Element) => {
      const tag = node.tagName
      if (tag === 'A') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }
      if (tag === 'IMG') {
        node.setAttribute('referrerpolicy', 'no-referrer')
      }
    })
  } catch (err) {
    console.warn('DOMPurify hook registration failed', err)
  }
}

const safeHtml = computed(() => {
  const raw = md.render(props.text || '')
  // Allow span/class so highlight.js classes are kept
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      'a','b','i','em','strong','p','ul','ol','li','code','pre','br','hr','blockquote',
      'h1','h2','h3','h4','h5','h6','img','table','thead','tbody','tr','th','td','span'
    ],
    ALLOWED_ATTR: ['href','title','alt','src','class','name','target','rel','referrerpolicy']
  })
})
</script>

<style scoped>
@import 'highlight.js/styles/github-dark.css';

/* Container base */
.ai-markdown {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  font-size: 13.5px; /* slightly smaller */
  line-height: 1.38; /* tighter */
  color: #24303f;
  white-space: pre-wrap;
  word-break: break-word;
  padding-left: 10px; /* less inner padding */
  padding-right: 6px;
}

/* Paragraphs and spacing - tightened */
.ai-markdown p {
  margin: 0 0 0.42em 0; /* slightly tighter */
}

/* Headings - tightened */
.ai-markdown h1,
.ai-markdown h2,
.ai-markdown h3,
.ai-markdown h4,
.ai-markdown h5,
.ai-markdown h6 {
  margin: 0.32em 0 0.18em 0;
  font-weight: 600;
  color: #102a43;
}
.ai-markdown h1 { font-size: 1.16rem; }
.ai-markdown h2 { font-size: 1.03rem; }
.ai-markdown h3 { font-size: 0.96rem; }
.ai-markdown h4 { font-size: 0.9rem; }

/* Links */
.ai-markdown a {
  color: #2b6ef6;
  text-decoration: underline;
}
.ai-markdown a:hover {
  text-decoration: none;
}

/* Lists: tighter spacing */
.ai-markdown ul,
.ai-markdown ol {
  margin: 0 0 0.48em 1.3rem;
  padding-left: 0;
  list-style-position: outside;
}
.ai-markdown li {
  margin: 0.08em 0; /* much tighter */
  padding-left: 0.2rem;
}

/* Custom numbered markers for ordered lists */
.ai-markdown ol {
  counter-reset: md-counter;
  list-style: none;
}
.ai-markdown ol > li {
  counter-increment: md-counter;
  position: relative;
  padding-left: 2.1rem; /* a bit less space */
}
.ai-markdown ol > li::before {
  content: counter(md-counter);
  position: absolute;
  left: 0;
  top: 0.12rem;
  width: 1.3rem;
  height: 1.3rem;
  line-height: 1.3rem;
  text-align: center;
  background: linear-gradient(180deg, #eef2ff, #e6f0ff);
  color: #1f2937;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(12,18,31,0.06);
  border: 1px solid rgba(15,23,42,0.04);
  font-size: 0.78rem;
}

/* Inline code */
.ai-markdown code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Droid Sans Mono", "Courier New", monospace;
  background: rgba(27,31,35,0.05);
  padding: 0.1em 0.24em;
  border-radius: 4px;
  font-size: 0.9em;
}

/* Code blocks - tighter */
.ai-markdown pre {
  border-radius: 8px;
  overflow: auto;
  margin: 0 0 0.48em 0;
}
.ai-markdown pre code {
  display: block;
  padding: 8px; /* smaller padding */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Droid Sans Mono", "Courier New", monospace;
  font-size: 12.5px;
  line-height: 1.35;
}

/* Blockquotes - tighter */
.ai-markdown blockquote {
  border-left: 4px solid rgba(43,110,246,0.12);
  background: rgba(43,110,246,0.03);
  padding: 6px 8px;
  margin: 0 0 0.42em 0;
  border-radius: 6px;
  color: #344e6a;
}

/* Tables - reduced spacing */
.ai-markdown table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 0.48em 0;
  overflow: auto;
}
.ai-markdown th,
.ai-markdown td {
  border: 1px solid rgba(15,23,42,0.06);
  padding: 5px 6px;
  text-align: left;
}
.ai-markdown th {
  background: rgba(15,23,42,0.03);
  font-weight: 600;
}

/* Images */
.ai-markdown img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0.3em 0;
  border-radius: 6px;
}

/* Small helper for horizontal rules */
.ai-markdown hr {
  border: none;
  height: 1px;
  background: rgba(15,23,42,0.06);
  margin: 0.4em 0;
}
</style>
