type LoadingStateProps = {
  text?: string;
};

export function LoadingState({ text = 'Carregando dados...' }: LoadingStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
