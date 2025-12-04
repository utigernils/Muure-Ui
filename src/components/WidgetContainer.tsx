import * as LucideIcons from "lucide-react";

interface WidgetContainerProps {
  children?: React.ReactNode;
  title?: string;
  className?: string;
  icon?: string;
}

function WidgetContainer({
  children,
  title,
  className = "",
  icon,
}: WidgetContainerProps) {
  const IconComponent = icon ? (LucideIcons as any)[icon] : null;

  return (
    <div
      className={`w-full h-full border-2 border-neutral-500 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-1 ${className}`}
    >
      {title && (
        <div className="h-12 w-full">
          <h2 className="text-2xl font-semibold h-full flex items-center ml-4 gap-2">
            {IconComponent && <IconComponent size={24} />}
            {title}
          </h2>
        </div>
      )}
      <div className="flex-1 w-full rounded-xl overflow-hidden bg-neutral-200">
        {children}
      </div>
    </div>
  );
}

export default WidgetContainer;
