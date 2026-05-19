import Link from "next/link";

const messages: Record<string, string> = {
  missing_code: "Something went wrong during sign-in. Please try again.",
  exchange_failed:
    "We couldn't complete sign-in with Google. Try again, and if it keeps happening contact the Operations Manager.",
  domain:
    "You can only sign in with a @digitalnexa.com Google Workspace account.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message =
    (reason && messages[reason]) ??
    "Sign-in failed. Please return to the login page and try again.";

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="max-w-md w-full bg-panel border border-border rounded-lg p-8 text-center">
        <h1 className="text-xl font-semibold text-text-1 mb-2">
          Sign-in problem
        </h1>
        <p className="text-text-2 text-sm mb-6">{message}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-text-1 text-white text-sm font-medium hover:bg-nexa-purple transition"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
