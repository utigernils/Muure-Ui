interface DebugWidgetProps {
  className?: string;
}

function DebugWidget({ className = "" }: DebugWidgetProps) {
  return (
    <>
      <style>{`
        @keyframes bgToggle {
          0% { background: black; }
          50% { background: white; }
          100% { background: black; }
        }
        .bg-animated {
          animation: bgToggle 10s steps(1, end) infinite;
        }
      `}</style>
      <div className={`w-full h-full bg-animated ${className}`} />
    </>
  );
}

export default DebugWidget;
