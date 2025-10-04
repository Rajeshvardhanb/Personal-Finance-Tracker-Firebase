import React from "react";

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold tracking-tighter text-foreground">{title}</h1>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
