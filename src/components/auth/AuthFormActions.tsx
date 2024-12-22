interface AuthFormActionsProps {
  view: 'login' | 'signup';
  setView: (view: 'login' | 'signup') => void;
}

export function AuthFormActions({ view, setView }: AuthFormActionsProps) {
  return (
    <div className="mt-4 text-center text-sm text-gray-500">
      {view === 'login' ? (
        <>
          Don't have an account?{" "}
          <button
            onClick={() => setView('signup')}
            className="text-blue-600 hover:text-blue-500"
          >
            Sign up
          </button>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <button
            onClick={() => setView('login')}
            className="text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
}