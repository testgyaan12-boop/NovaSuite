type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
