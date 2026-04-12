import CalendarioFaculdade from "../../components/calendario-faculdade";

export default function CalendarioPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#e5e7eb] p-6 md:p-10">
      <div className="w-full max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Calendário da Faculdade</h1>
        <CalendarioFaculdade />
      </div>
    </main>
  );
}