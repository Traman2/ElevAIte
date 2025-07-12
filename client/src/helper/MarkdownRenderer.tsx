import { marked } from 'marked';
import './MarkdownRenderer.css';

type Props = {
  mdText: string;
};

export default function MarkdownRenderer({ mdText } : Props) {
  const parsedText = mdText.replace(/\\n/g, '\n');
  const html = marked.parse(parsedText);

  return (
    <div
      className="markdown-renderer"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}