export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            A sign-in link has been sent to your email address.
          </p>
        </div>
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Verification email sent</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Click the link in your email to sign in. If you don't see the email, check your spam folder.
                </p>
                <p className="mt-4">
                  The link will expire after 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}