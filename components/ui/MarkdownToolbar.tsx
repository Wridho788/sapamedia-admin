type MarkdownToolbarProps = {
  onInsert: (text: string) => void;
};

const tools = [
  { label: 'B', text: '**bold**' },
  { label: 'I', text: '*italic*' },
  { label: 'Link', text: '[text](url)' },
  { label: 'Code', text: '`code`' },
  { label: 'Image', text: '![alt](image-url)' },
];

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          className="rounded-md border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          onClick={() => onInsert(tool.text)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
