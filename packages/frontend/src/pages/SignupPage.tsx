import { AuthView } from "@daveyplate/better-auth-ui";

export function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md py-12">
      <AuthView
        cardHeader={
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl">Crea un account</h1>
            <p className="text-muted-foreground text-sm">
              Registrati con username o email e imposta la tua password.
            </p>
          </div>
        }
        classNames={{
          footer: "text-muted-foreground text-sm",
          footerLink: "text-primary underline",
        }}
        view="SIGN_UP"
      />
    </div>
  );
}
