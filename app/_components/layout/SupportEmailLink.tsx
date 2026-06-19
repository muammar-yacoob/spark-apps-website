export function SupportEmailLink() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <a href={`mailto:${email}`} className="text-blue-400 hover:text-blue-300 underline">
      {email}
    </a>
  );
}
