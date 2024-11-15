export default function ApplyFormLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="my-4 grid grid-cols-12 gap-6 mx-4 w-full">{children}</div>;
}
