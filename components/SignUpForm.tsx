"use client";

import { signUpAction } from "@/app/sign-up/actions";
import { useFormState } from "@/lib/hook";

export default function SignUpForm() {
  const [state, handleSubmit] = useFormState(signUpAction);

  return (
    <form
      onSubmit={handleSubmit}
      className="border bg-white flex flex-col gap-2
                 max-w-screen-sm mt-3 px-3 py-3 rounded"
    >
      <div className="flex">
        <label htmlFor="emailField" className="shrink-0 w-32">
          Email
        </label>
        <input
          id="emailField"
          name="email"
          type="email"
          required
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div className="flex">
        <label htmlFor="nameField" className="shrink-0 w-32">
          Name
        </label>
        <input
          id="nameField"
          name="name"
          type="text"
          required
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div className="flex">
        <label htmlFor="passwordField" className="shrink-0 w-32">
          Password
        </label>
        <input
          id="passwordField"
          name="password"
          type="password"
          required
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      {Boolean(state.error) && (
        <p className="text-red-700">{state.error.message}</p>
      )}
      <button
        type="submit"
        disabled={state.loading}
        className="bg-orange-800 rounded px-2 py-1 self-center
                   text-slate-50 w-32 hover:bg-orange-700
                   disabled:bg-slate-500 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
}
